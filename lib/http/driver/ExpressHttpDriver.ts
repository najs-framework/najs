import { HttpKernel } from './../HttpKernel'
import { HttpKernelClass, HttpDriverClass, ConfigurationKeys } from '../../constants'
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver'
import { IAutoload } from '../../core/IAutoload'
import { IRouteData } from '../routing/interfaces/IRouteData'
import { register } from '../../index'
import { Log } from '../../log/Log'
import { flatten, isFunction, isString, isObject } from 'lodash'
import { Controller } from '../controller/Controller'
import { RouteCollection } from '../routing/RouteCollection'
import { make } from '../../core/make'
import { isIResponse } from '../response/IResponse'
import { isPromise } from '../../private/isPromise'
import { IMiddleware } from '../middleware/IMiddleware'
import { NajsFacade as Najs } from '../../core/NajsFacade'
import { NajsPath } from '../../core/INajsFacade'
import * as Express from 'express'
import * as Http from 'http'
import * as BodyParser from 'body-parser'
import * as CookieParser from 'cookie-parser'
import * as ExpressHandlerBars from 'express-handlebars'

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
  protected express: ExpressApp
  protected server: Http.Server
  protected httpKernel: HttpKernel

  constructor() {
    this.express = this.setup()
    this.httpKernel = make<HttpKernel>(HttpKernelClass)
  }

  protected setup(): ExpressApp {
    const app: ExpressApp = Express()
    this.setupBodyParser(app)
    this.setupCookieParser(app)
    this.setupViewEngine(app)
    this.setupStaticAssets(app)
    return app
  }

  protected setupBodyParser(app: ExpressApp) {
    app.use(BodyParser.json())
    app.use(BodyParser.urlencoded({ extended: true }))
  }

  protected setupCookieParser(app: ExpressApp) {
    app.use(CookieParser())
  }

  protected setupViewEngine(app: ExpressApp) {
    const viewEngine: string = Najs.getConfig(ConfigurationKeys.ViewEngineName, 'hbs')
    app.engine(
      viewEngine,
      ExpressHandlerBars(
        Najs.getConfig(ConfigurationKeys.HandlerBarsOptions, {
          layoutsDir: Najs.path(NajsPath.Layout),
          extname: '.hbs',
          defaultLayout: 'default'
        })
      )
    )
    app.set('view engine', viewEngine)
    app.set('views', Najs.path(NajsPath.View))
  }

  protected setupStaticAssets(app: ExpressApp) {
    app.use(Express.static(Najs.path(NajsPath.Public)))
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
        await this.handleEndpointResult(request, response, result, middleware)
      }
    }
  }

  protected createEndpointWrapperByObject(controllerObject: Object, endpointName: string, middleware: IMiddleware[]) {
    return async (request: Express.Request, response: Express.Response) => {
      const controller: Object = this.cloneControllerObject(controllerObject, request, response)
      const endpoint: any = Reflect.get(controller, endpointName)
      if (isFunction(endpoint)) {
        const result = Reflect.apply(endpoint, controller, [request, response])
        await this.handleEndpointResult(request, response, result, middleware)
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
      // Can not use make for default Controller
      const controller = Reflect.construct(Controller, [request, response])
      const result = Reflect.apply(endpoint, controller, [request, response])
      await this.handleEndpointResult(request, response, result, middleware)
    }
  }

  protected async applyAfterMiddlewareWrapper(
    middlewareList: IMiddleware[],
    request: Express.Request,
    response: Express.Response,
    value: any
  ): Promise<any> {
    if (middlewareList.length === 0) {
      return value
    }

    let result: any = value
    for (const middleware of middlewareList) {
      if (isFunction(middleware.after)) {
        result = await Reflect.apply(middleware.after, middleware, [request, response, result])
      }
    }
    return result
  }

  protected async handleEndpointResult(
    request: Express.Request,
    response: Express.Response,
    result: any,
    middleware: IMiddleware[]
  ) {
    const rawValue: any = isPromise(result) ? await (result as Promise<any>) : result
    const value: any = await this.applyAfterMiddlewareWrapper(middleware, request, response, rawValue)
    if (isIResponse(value)) {
      return value.respond(response, this)
    }
  }

  start(options: HttpDriverStartOptions) {
    const server = Http.createServer(this.express)
    server.listen(options.port, options.host)

    const logs: any[] = ['Listening at port ']
    if (options.host) {
      logs.push(options.host + ':')
    }
    logs.push(options.port || 3000)
    Log.info(logs.join(''))
    Log.info('Routes:')
    RouteCollection.getData().map(this.route.bind(this))
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

// register ExpressHttpDriver and using it as a default HttpDriverClass
register(ExpressHttpDriver)
register(ExpressHttpDriver, HttpDriverClass)
