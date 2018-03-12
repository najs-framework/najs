import { ExpressMiddlewareBase } from './ExpressMiddlewareBase'
import * as Express from 'express'
const ExpressRequestId = require('express-request-id')

export let RequestIdGenerator: Express.Handler

export class RequestIdMiddleware extends ExpressMiddlewareBase {
  static className: string = 'Najs.RequestIdMiddleware'

  protected parseIdentify(...args: string[]): string {
    return 'request-id'
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
