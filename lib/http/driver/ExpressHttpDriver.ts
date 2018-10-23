/// <reference path="../../contracts/HttpDriver.ts" />
/// <reference path="../../contracts/types/http.ts" />

import { HttpKernel } from '../HttpKernel'
import { Najs, SystemClass, ConfigurationKeys } from '../../constants'
import { make } from 'najs-binding'
import { register } from '../..'
import { LogFacade as Log } from '../../facades/global/LogFacade'
import { isFunction, isString } from 'lodash'
import { Controller } from '../controller/Controller'
import { ExpressController } from '../controller/ExpressController'
import { RouteCollection } from '../routing/RouteCollection'
import { isResponse } from '../../private/isResponse'
import { isPromise } from '../../private/isPromise'
import { ConfigFacade } from '../../facades/global/ConfigFacade'
import { PathFacade } from '../../facades/global/PathFacade'
import { RouteMiddlewareUtil } from './private/RouteMiddlewareUtil'
import * as Express from 'express'
import * as Http from 'http'
import * as ExpressHandlebars from 'express-handlebars'

export type ExpressApp = Express.Express

export type ExpressHandlers = Array<Express.RequestHandler | Express.ErrorRequestHandler>

const METHODS: string[] = [
  'all',
  'checkout',
  'copy',
  'delete',
  'get',
  'head',
  'lock',
  'merge',
  'mkactivity',
  'mkcol',
  'move',
  'm-search',
  'notify',
  'options',
  'patch',
  'post',
  'purge',
  'put',
  'report',
  'search',
  'subscribe',
  'trace',
  'unlock',
  'unsubscribe'
]

export class ExpressHttpDriver implements Najs.Contracts.HttpDriver<ExpressApp, Express.Response> {
  static className: string = Najs.Http.ExpressHttpDriver

  protected express: ExpressApp
  protected server: Http.Server
  protected httpKernel: HttpKernel

  constructor() {
    this.express = this.setup()
    this.httpKernel = make<HttpKernel>(SystemClass.HttpKernel)
  }

  protected setup(): ExpressApp {
    const app: ExpressApp = Express()
    this.setupViewEngine(app)
    return app
  }

  protected setupViewEngine(app: ExpressApp) {
    const viewEngine: string = ConfigFacade.get(ConfigurationKeys.ViewEngineName, 'hbs')
    app.engine(
      viewEngine,
      ExpressHandlebars(
        ConfigFacade.get(ConfigurationKeys.HandlebarsOptions, {
          layoutsDir: PathFacade.layout(),
          extname: '.hbs',
          defaultLayout: 'default'
        })
      )
    )
    app.set('view engine', viewEngine)
    app.set('views', PathFacade.view())
  }

  getClassName() {
    return Najs.Http.ExpressHttpDriver
  }

  getNativeDriver(): ExpressApp {
    return this.express
  }

  // -------------------------------------------------------------------------------------------------------------------

  route(route: Najs.Http.IRouteData) {
    const method: string = route.method.toLowerCase()
    if (METHODS.indexOf(method) === -1) {
      return
    }

    const path: string = route.prefix + route.path
    const handlers: ExpressHandlers = this.getEndpointHandlers(method, path, route)
    if (handlers.length === 0) {
      return
    }
    Log.info('  [' + method.toUpperCase() + '] \t' + path)
    Reflect.apply(Reflect.get(this.express, method), this.express, [path, ...handlers])
  }

  protected getEndpointHandlers(method: string, path: string, route: Najs.Http.IRouteData): ExpressHandlers {
    const middlewareList: Najs.Http.IMiddleware[] = RouteMiddlewareUtil.getMiddlewareListOfRoute(route, this.httpKernel)
    const handlers: ExpressHandlers = this.createHandlersForRoute(route, middlewareList)

    if (isFunction(route.endpoint)) {
      handlers.push(this.createEndpointWrapperByFunction(route.endpoint, middlewareList))
      return handlers
    }

    if (isFunction(route.controller) || isString(route.controller)) {
      handlers.push(this.createEndpointWrapper(<any>route.controller, <string>route.endpoint, middlewareList))
      return handlers
    }

    handlers.push(this.createEndpointWrapperByObject(<Object>route.controller, <string>route.endpoint, middlewareList))
    return handlers
  }

  protected createHandlersForRoute(
    route: Najs.Http.IRouteData,
    middlewareList: Najs.Http.IMiddleware[]
  ): ExpressHandlers {
    const handlers: ExpressHandlers = <ExpressHandlers>route.middleware.filter(function(middleware) {
      return isFunction(middleware)
    })

    if (middlewareList.length > 0) {
      const nativeMiddleware: Najs.Http.NativeMiddleware[] = RouteMiddlewareUtil.createNativeMiddlewareHandlers(
        middlewareList,
        this
      )
      if (nativeMiddleware.length > 0) {
        return handlers.concat(nativeMiddleware)
      }
    }
    return handlers
  }

  protected createEndpointWrapper(controllerName: string, endpointName: string, middleware: Najs.Http.IMiddleware[]) {
    return async (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
      const controller = make<Controller>(controllerName, [request, response])
      const endpoint: any = Reflect.get(controller, endpointName)
      if (isFunction(endpoint)) {
        await this.triggerEndpoint(<any>controller, endpoint, request, response, middleware, next)
      }
    }
  }

  protected createEndpointWrapperByObject(
    controllerObject: Object,
    endpointName: string,
    middleware: Najs.Http.IMiddleware[]
  ) {
    return async (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
      const controller: Object = this.cloneControllerObject(controllerObject, request, response)
      const endpoint: any = Reflect.get(controller, endpointName)
      if (isFunction(endpoint)) {
        await this.triggerEndpoint(<any>controller, endpoint, request, response, middleware, next)
      }
    }
  }

  protected cloneControllerObject(controller: Object, request: Express.Request, response: Express.Response): Object {
    if (controller instanceof Controller) {
      return make(controller.getClassName(), [request, response])
    }
    return Object.assign({}, controller, { request, response })
  }

  protected createEndpointWrapperByFunction(endpoint: Function, middleware: Najs.Http.IMiddleware[]) {
    return async (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
      // Can not use make for default ExpressController
      const controller = Reflect.construct(ExpressController, [request, response])
      await this.triggerEndpoint(<any>controller, endpoint, request, response, middleware, next)
    }
  }

  protected async triggerEndpoint(
    controller: Controller,
    endpoint: Function,
    request: Express.Request,
    response: Express.Response,
    middleware: Najs.Http.IMiddleware[],
    next: Express.NextFunction
  ) {
    try {
      await RouteMiddlewareUtil.applyBeforeMiddleware(middleware, request, response, controller)
      const result = Reflect.apply(endpoint, controller, [request, response, next])
      return this.handleEndpointResult(request, response, result, controller, middleware)
    } catch (error) {
      next(error)
    }
  }

  protected async handleEndpointResult(
    request: Express.Request,
    response: Express.Response,
    result: any,
    controller: Controller,
    middleware: Najs.Http.IMiddleware[]
  ) {
    const rawValue: any = isPromise(result) ? await (result as Promise<any>) : result
    const value: any = await RouteMiddlewareUtil.applyAfterMiddleware(
      middleware,
      request,
      response,
      rawValue,
      controller
    )
    if (isResponse(value)) {
      return value.respond(request, response, this)
    }
  }

  start(options?: Najs.Http.StartOptions) {
    RouteCollection.getData().map(this.route.bind(this))
    const opts: Najs.Http.StartOptions = Object.assign(
      {},
      {
        createServer: true,
        port: ConfigFacade.get(ConfigurationKeys.Port, 3000),
        host: ConfigFacade.get(ConfigurationKeys.Host, 'localhost')
      },
      options
    )
    if (opts.createServer) {
      const server = Http.createServer(this.express)
      server.listen(opts.port, opts.host)

      const logs: any[] = ['Listening at ']
      logs.push(opts.host + ':')
      logs.push(opts.port)
      Log.info(logs.join(''))
      Log.info('Routes:')
    }
  }

  respondView(response: Express.Response, view: string, variables: Object): void {
    response.render(view, variables)
  }

  respondJson(response: Express.Response, value: any): void {
    response.json(value)
  }

  respondJsonp(response: Express.Response, value: any): void {
    response.jsonp(value)
  }

  respondRedirect(response: Express.Response, url: string, status: number): void {
    response.redirect(status, url)
  }
}
register(ExpressHttpDriver, Najs.Http.ExpressHttpDriver)
