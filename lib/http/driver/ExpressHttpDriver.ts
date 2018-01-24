import { HttpDriverClass } from './../../constants'
import { IHttpDriver, HttpDriverSetupFunction, HttpDriverDidSetupHandler, HttpDriverStartOptions } from './IHttpDriver'
import { IAutoload } from '../../core/IAutoload'
import { IRouteData } from '../routing/interfaces/IRouteData'
import { isFunction } from 'lodash'
import { register } from '../../index'
import * as Express from 'express'

export type ExpressApp = Express.Express

export class ExpressHttpDriver implements IHttpDriver, IAutoload {
  static className: string = 'ExpressHttpDriver'
  private express: ExpressApp
  private setupFunction?: HttpDriverSetupFunction<Express.Express>
  private didSetupHandler?: HttpDriverDidSetupHandler<Express.Express>

  getClassName() {
    return ExpressHttpDriver.className
  }

  getNativeDriver(): ExpressApp {
    return this.express
  }

  initialize(): void {
    this.express = isFunction(this.setupFunction) ? this.setupFunction() : this.defaultInitialize()
    if (isFunction(this.didSetupHandler)) {
      this.didSetupHandler(this.express)
    }
  }

  private defaultInitialize(): ExpressApp {
    const app: Express.Express = Express()
    return app
  }

  setup(setupFunction: HttpDriverSetupFunction<Express.Express>): this {
    this.setupFunction = setupFunction
    return this
  }

  driverDidSetup(handler: HttpDriverDidSetupHandler<Express.Express>): this {
    this.didSetupHandler = handler
    return this
  }

  // -------------------------------------------------------------------------------------------------------------------

  route(route: IRouteData) {}

  start(options: HttpDriverStartOptions) {}

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
