import { HttpKernel } from './../HttpKernel'
import { SystemClass, ConfigurationKeys } from '../../constants'
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver'
import { IAutoload, make } from 'najs-binding'
import { IRouteData } from '../routing/interfaces/IRouteData'
import { register } from '../../index'
import { LogFacade as Log } from '../../facades/global/LogFacade'
import { flatten, isFunction, isString, isObject } from 'lodash'
import { Controller } from '../controller/Controller'
import { ExpressController } from '../controller/ExpressController'
import { RouteCollection } from '../routing/RouteCollection'
import { isIResponse } from '../response/IResponse'
import { isPromise } from '../../private/isPromise'
import { IMiddleware } from '../middleware/IMiddleware'
import { ConfigFacade } from '../../facades/global/ConfigFacade'
import { PathFacade } from '../../facades/global/PathFacade'
import * as Express from 'express'
import * as Http from 'http'
import * as BodyParser from 'body-parser'
import * as ExpressHandlebars from 'express-handlebars'

const addRequestIdMiddleware = require('express-request-id')()

export type ExpressApp = Express.Express

export type ExpressHandlers = Array<Express.RequestHandler | Express.ErrorRequestHandler>

export class ExpressHttpDriver implements IHttpDriver, IAutoload {
  static METHODS: string[] = [
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
  static className: string = 'ExpressHttpDriver'

  static setXPoweredByMiddleware(poweredBy: string = 'Najs/Express') {
    return function(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
      response.setHeader('X-Powered-By', poweredBy)
      next()
    }
  }

  static addRequestIdMiddleware(poweredBy: string = 'Najs/Express') {
    return addRequestIdMiddleware
  }

  protected express: ExpressApp
  protected server: Http.Server
  protected httpKernel: HttpKernel

  constructor() {
    this.express = this.setup()
    this.httpKernel = make<HttpKernel>(SystemClass.HttpKernel)
  }

  protected setup(): ExpressApp {
    const app: ExpressApp = Express()
    this.setupBodyParser(app)
    this.setupViewEngine(app)
    this.setupStaticAssets(app)
    app.use(ExpressHttpDriver.addRequestIdMiddleware())
    app.use(ExpressHttpDriver.setXPoweredByMiddleware())
    return app
  }

  protected setupBodyParser(app: ExpressApp) {
    app.use(BodyParser.json())
    app.use(BodyParser.urlencoded({ extended: true }))
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

  protected setupStaticAssets(app: ExpressApp) {
    app.use(Express.static(PathFacade.public()))
  }

  getClassName() {
    return ExpressHttpDriver.className
  }

  getNativeDriver(): ExpressApp {
    return this.express
  }

  // -------------------------------------------------------------------------------------------------------------------

  route(route: IRouteData) {
    const method: string = route.method.toLowerCase()
    if (ExpressHttpDriver.METHODS.indexOf(method) === -1) {
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

  protected getEndpointHandlers(method: string, path: string, route: IRouteData): ExpressHandlers {
    const handlers: ExpressHandlers = []
    // create middleware handlers
    const middlewareListBucket: IMiddleware[][] = []
    for (const middleware of route.middleware) {
      if (isFunction(middleware)) {
        handlers.push(middleware)
        continue
      }
      middlewareListBucket.push(this.getMiddlewareList(middleware))
    }

    const middlewareList: IMiddleware[] = Array.from(new Set(flatten(middlewareListBucket)))
    if (middlewareList.length > 0) {
      this.createNativeMiddlewareWrapper(middlewareList)
      handlers.push(this.createBeforeMiddlewareWrapper(middlewareList))
    }

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

  protected getMiddlewareList(middleware: any): IMiddleware[] {
    if (isString(middleware)) {
      return this.httpKernel.getMiddleware(middleware)
    }
    if (isObject(middleware)) {
      return [middleware]
    }
    return []
  }

  protected createBeforeMiddlewareWrapper(middlewareList: IMiddleware[]) {
    return async (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
      for (const middleware of middlewareList) {
        if (isFunction(middleware.before)) {
          try {
            await Reflect.apply(middleware.before, middleware, [request, response])
          } catch (error) {
            return next(error)
          }
        }
      }
      next()
    }
  }

  protected createNativeMiddlewareWrapper(middlewareList: IMiddleware[]) {
    for (const middleware of middlewareList) {
      if (isFunction(middleware.native)) {
        Reflect.apply(middleware.native, middleware, [this])
      }
    }
  }

  protected createEndpointWrapper(controllerName: string, endpointName: string, middleware: IMiddleware[]) {
    return async (request: Express.Request, response: Express.Response) => {
      const controller = make<Controller>(controllerName, [request, response])
      const endpoint: any = Reflect.get(controller, endpointName)
      if (isFunction(endpoint)) {
        const result = Reflect.apply(endpoint, controller, [request, response])
        await this.handleEndpointResult(request, response, result, controller, middleware)
      }
    }
  }

  protected createEndpointWrapperByObject(controllerObject: Object, endpointName: string, middleware: IMiddleware[]) {
    return async (request: Express.Request, response: Express.Response) => {
      const controller: Object = this.cloneControllerObject(controllerObject, request, response)
      const endpoint: any = Reflect.get(controller, endpointName)
      if (isFunction(endpoint)) {
        const result = Reflect.apply(endpoint, controller, [request, response])
        await this.handleEndpointResult(request, response, result, <any>controller, middleware)
      }
    }
  }

  protected cloneControllerObject(controller: Object, request: Express.Request, response: Express.Response): Object {
    if (controller instanceof Controller) {
      return make(controller.getClassName(), [request, response])
    }
    return Object.assign({}, controller, { request, response })
  }

  protected createEndpointWrapperByFunction(endpoint: Function, middleware: IMiddleware[]) {
    return async (request: Express.Request, response: Express.Response) => {
      // Can not use make for default ExpressController
      const controller = Reflect.construct(ExpressController, [request, response])
      const result = Reflect.apply(endpoint, controller, [request, response])
      await this.handleEndpointResult(request, response, result, controller, middleware)
    }
  }

  protected async applyAfterMiddlewareWrapper(
    middlewareList: IMiddleware[],
    request: Express.Request,
    response: Express.Response,
    value: any,
    controller: Controller
  ): Promise<any> {
    if (middlewareList.length === 0) {
      return value
    }

    let result: any = value
    for (const middleware of middlewareList) {
      if (isFunction(middleware.after)) {
        result = await Reflect.apply(middleware.after, middleware, [request, response, result, controller])
      }
    }
    return result
  }

  protected async handleEndpointResult(
    request: Express.Request,
    response: Express.Response,
    result: any,
    controller: Controller,
    middleware: IMiddleware[]
  ) {
    const rawValue: any = isPromise(result) ? await (result as Promise<any>) : result
    const value: any = await this.applyAfterMiddlewareWrapper(middleware, request, response, rawValue, controller)
    if (isIResponse(value)) {
      return value.respond(request, response, this)
    }
  }

  start(options?: HttpDriverStartOptions) {
    RouteCollection.getData().map(this.route.bind(this))
    const opts: HttpDriverStartOptions = Object.assign(
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
register(ExpressHttpDriver)
