import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase'
import { IAutoload, register } from 'najs-binding'
import * as Express from 'express'

export let PoweredBySetter: Express.Handler

export class PoweredByMiddleware extends ExpressMiddlewareBase implements IAutoload {
  static className: string = 'Najs.PoweredByMiddleware'
  protected poweredBy: string

  getClassName() {
    return PoweredByMiddleware.className
  }

  protected parseIdentify(...args: string[]): string {
    return 'powered-by'
  }

  protected parseLevel(level: string): boolean {
    this.isAppLevel = true
    return true
  }

  protected parseParams(...args: string[]) {
    this.poweredBy = args[1] || 'Najs/Express'
    return this.poweredBy
  }

  createMiddleware(): Express.Handler | Express.Handler[] | undefined {
    if (!PoweredBySetter) {
      PoweredBySetter = (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
        response.setHeader('X-Powered-By', this.poweredBy)
        next()
      }
    }
    return PoweredBySetter
  }
}
register(PoweredByMiddleware)
