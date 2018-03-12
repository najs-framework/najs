import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase'
import { IAutoload, register } from 'najs-binding'
import * as Express from 'express'
const ExpressRequestId = require('express-request-id')

export let RequestIdGenerator: Express.Handler

export class RequestIdMiddleware extends ExpressMiddlewareBase implements IAutoload {
  static className: string = 'Najs.RequestIdMiddleware'

  getClassName() {
    return RequestIdMiddleware.className
  }

  protected parseIdentify(...args: string[]): string {
    this.identify = 'request-id'
    return this.identify
  }

  protected parseLevel(level: string): boolean {
    this.isAppLevel = true
    return true
  }

  createMiddleware(): Express.Handler | Express.Handler[] | undefined {
    if (!RequestIdGenerator) {
      RequestIdGenerator = ExpressRequestId()
    }
    return RequestIdGenerator
  }
}
register(RequestIdMiddleware)
