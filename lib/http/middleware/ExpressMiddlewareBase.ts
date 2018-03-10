import * as Express from 'express'
import { ExpressHttpDriver } from '../driver/ExpressHttpDriver'
import { IExpressMiddleware } from './IExpressMiddleware'

export class ExpressMiddlewareBase implements IExpressMiddleware {
  protected identify: string
  protected name: string
  protected isAppLevel: boolean
  protected meta: string

  constructor(name: string, level: string) {
    this.name = name
    this.parseLevel(level)
    this.parseParams(...arguments)
    this.identify = Array.from(arguments).join(':')
  }

  protected parseParams(...args: any[]) {}

  protected parseLevel(level: string) {
    this.isAppLevel = level === 'global' || level === 'app' || level === 'app-level'
  }

  createMiddleware(): Express.Handler | Express.Handler[] | undefined {
    return undefined
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
      for (const handler in handlers) {
        app.use(handler)
      }
      app['_najsMiddleware'][this.identify] = handlers
    }
    return undefined
  }
}
