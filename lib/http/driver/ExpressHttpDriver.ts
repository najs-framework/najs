import { HttpDriverClass } from './../../constants'
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver'
import { IAutoload } from '../../core/IAutoload'
import { IRouteData } from '../routing/interfaces/IRouteData'
import { register } from '../../index'
import { Log } from '../../log/Log'
import { isFunction, isString } from 'lodash'
import { Controller } from '../controller/Controller'
import { RouteCollection } from '../routing/RouteCollection'
import { make } from '../../core/make'
import { isIResponse } from '../response/IResponse'
import * as Express from 'express'
import * as Http from 'http'
import { isPromise } from '../../private/isPromise'

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

  constructor() {
    this.express = this.setup()
  }

  protected setup(): ExpressApp {
    const app: ExpressApp = Express()
    return app
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

    if (isFunction(route.endpoint)) {
      handlers.push(this.createEndpointWrapperByFunction(route.endpoint))
      return handlers
    }

    if (isFunction(route.controller) || isString(route.controller)) {
      handlers.push(this.createEndpointWrapper(<any>route.controller, <string>route.endpoint))
      return handlers
    }

    handlers.push(this.createEndpointWrapperByObject(<Object>route.controller, <string>route.endpoint))
    return handlers
  }

  protected createEndpointWrapper(controllerName: string, endpointName: string) {
    return async (request: Express.Request, response: Express.Response) => {
      const controller = make<Controller>(controllerName, [request, response])
      const endpoint: any = Reflect.get(controller, endpointName)
      if (isFunction(endpoint)) {
        const result = Reflect.apply(endpoint, controller, [request, response])
        await this.handleEndpointResult(response, result)
      }
    }
  }

  protected createEndpointWrapperByObject(controllerObject: Object, endpointName: string) {
    return async (request: Express.Request, response: Express.Response) => {
      const controller: Object = this.cloneControllerObject(controllerObject, request, response)
      const endpoint: any = Reflect.get(controller, endpointName)
      if (isFunction(endpoint)) {
        const result = Reflect.apply(endpoint, controller, [request, response])
        await this.handleEndpointResult(response, result)
      }
    }
  }

  protected cloneControllerObject(controller: Object, request: Express.Request, response: Express.Response): Object {
    if (controller instanceof Controller) {
      return make(controller.getClassName(), [request, response])
    }
    return Object.assign({}, controller, { request, response })
  }

  protected createEndpointWrapperByFunction(endpoint: Function) {
    return async (request: Express.Request, response: Express.Response) => {
      // Can not use make for default Controller
      const controller = Reflect.construct(Controller, [request, response])
      const result = Reflect.apply(endpoint, controller, [request, response])
      await this.handleEndpointResult(response, result)
    }
  }

  protected async handleEndpointResult(response: Express.Response, result: any) {
    const value: any = isPromise(result) ? await (result as Promise<any>) : result
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

  respondJson(response: Express.Response, value: any): void {
    response.json(value)
  }

  respondRedirect(response: Express.Response, url: string, status: number): void {
    response.redirect(status, url)
  }
}

// register ExpressHttpDriver and using it as a default HttpDriverClass
register(ExpressHttpDriver)
register(ExpressHttpDriver, HttpDriverClass)
