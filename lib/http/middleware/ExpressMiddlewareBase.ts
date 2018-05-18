import * as Express from 'express'
import { ExpressHttpDriver } from '../driver/ExpressHttpDriver'
import { IExpressMiddleware } from './IExpressMiddleware'
import { HandlebarsViewResponse } from '../../view/handlebars/HandlebarsViewResponse'
import { HandlebarsHelper } from '../../view/handlebars/HandlebarsHelper'

export class ExpressMiddlewareBase implements IExpressMiddleware {
  protected identify: string
  protected name: string
  protected isAppLevel: boolean
  protected meta: string

  constructor(name: string, level?: string, ...args: string[]) {
    this.name = name
    this.parseLevel(level)
    this.parseParams(...arguments)
    this.parseIdentify(...arguments)
  }

  protected parseIdentify(...args: string[]): string {
    this.identify = args.join(':')
    return this.identify
  }

  protected parseParams(...args: any[]) {}

  protected parseLevel(level?: string): boolean {
    this.isAppLevel = level === 'global' || level === 'app' || level === 'app-level'
    return this.isAppLevel
  }

  createMiddleware(): Express.Handler | Express.Handler[] | undefined {
    return undefined
  }

  protected defineHandlebarsHelperIfNeeded(
    result: any,
    name: string,
    helper: typeof HandlebarsHelper,
    controller: any
  ) {
    if (result instanceof HandlebarsViewResponse) {
      result.helper(name, HandlebarsHelper.create(helper, controller))
    }
    return result
  }

  native(driver: ExpressHttpDriver): Express.Handler | Express.Handler[] | undefined {
    const middleware = this.createMiddleware()
    if (!middleware || !this.isAppLevel) {
      return middleware
    }

    // handle app level middleware, always returns undefined
    const app = driver.getNativeDriver()
    if (typeof app['_najsMiddleware'] === 'undefined') {
      app['_najsMiddleware'] = {}
    }

    if (!app['_najsMiddleware'][this.identify]) {
      const handlers: Express.Handler[] = Array.isArray(middleware) ? middleware : [middleware]
      for (const handler of handlers) {
        app.use(handler)
      }
      app['_najsMiddleware'][this.identify] = handlers
    }
    return undefined
  }
}
