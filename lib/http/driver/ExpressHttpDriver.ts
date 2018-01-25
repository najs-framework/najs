import { HttpDriverClass } from './../../constants'
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver'
import { IAutoload } from '../../core/IAutoload'
import { IRouteData } from '../routing/interfaces/IRouteData'
import { register } from '../../index'
import { Log } from '../../log/Log'
import * as Express from 'express'
import * as Http from 'http'

export type ExpressApp = Express.Express

export class ExpressHttpDriver implements IHttpDriver, IAutoload {
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

  route(route: IRouteData) {}

  start(options: HttpDriverStartOptions) {
    const server = Http.createServer(this.express)
    server.listen(options.port, options.host)

    const logs: any[] = ['Listening at port ']
    if (options.host) {
      logs.push(options.host + ':')
    }
    logs.push(options.port || 3000)
    Log.info(logs.join(''))
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
