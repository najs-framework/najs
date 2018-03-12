import { ConfigFacade } from '../../../facades/global/ConfigFacade'
import { ConfigurationKeys } from '../../../constants'
import { IAutoload, register } from 'najs-binding'
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase'
import * as Express from 'express'
import * as CORS from 'cors'

export let CorsEnable: Express.RequestHandler

export class CorsMiddleware extends ExpressMiddlewareBase implements IAutoload {
  static className: string = 'Najs.CorsMiddleware'

  getOptions() {
    return ConfigFacade.get(ConfigurationKeys.Middleware.corsOptions, {})
  }

  getClassName() {
    return CorsMiddleware.className
  }

  createMiddleware(): Express.Handler | Express.Handler[] | undefined {
    if (!CorsEnable) {
      CorsEnable = CORS(this.getOptions())
    }
    return CorsEnable
  }
}
register(CorsMiddleware)
