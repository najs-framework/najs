import { IHttpDriver, HttpDriverSetupFunction, HttpDriverDidSetupHandler, HttpDriverStartOptions } from '../IHttpDriver'
import { IAutoload } from '../../core/IAutoload'
import { IRouteData } from '../routing/interfaces/IRouteData'
import { isFunction } from 'lodash'
import { register } from '../../index'
import * as Express from 'express'

@register()
export class ExpressHttpDriver implements IHttpDriver, IAutoload {
  static driverName: string = 'express'
  private express: Express.Express
  private setupFunction?: HttpDriverSetupFunction<Express.Express>
  private didSetupHandler?: HttpDriverDidSetupHandler<Express.Express>

  getClassName() {
    return 'ExpressHttpDriver'
  }

  getDriverName(): string {
    return ExpressHttpDriver.driverName
  }

  initialize(): void {
    this.express = isFunction(this.setupFunction) ? this.setupFunction() : this.defaultInitialize()
    if (isFunction(this.didSetupHandler)) {
      this.didSetupHandler(this.express)
    }
  }

  private defaultInitialize(): Express.Express {
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
