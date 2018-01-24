import { HttpDriverClass } from './../../constants'
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver'
import { IAutoload } from '../../core/IAutoload'
import { IRouteData } from '../routing/interfaces/IRouteData'
import { register } from '../../index'
import * as Express from 'express'

export type ExpressApp = Express.Express

export class ExpressHttpDriver implements IHttpDriver, IAutoload {
  static className: string = 'ExpressHttpDriver'
  private express: ExpressApp

  constructor() {
    this.express = this.setup()
  }

  getClassName() {
    return ExpressHttpDriver.className
  }

  getNativeDriver(): ExpressApp {
    return this.express
  }

  setup(): ExpressApp {
    const app: ExpressApp = Express()
    return app
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
