import { ConfigFacade } from '../../facades/global/ConfigFacade'
import { ConfigurationKeys } from '../../constants'
import { IAutoload, register } from 'najs-binding'
import { IExpressMiddleware } from './IExpressMiddleware'
import * as Express from 'express'
import * as CORS from 'cors'

export let CorsEnable: Express.RequestHandler

export class ExpressCorsMiddleware implements IExpressMiddleware, IAutoload {
  static className: string = 'Najs.ExpressCorsMiddleware'

  constructor() {
    if (!CorsEnable) {
      CorsEnable = CORS(this.getOptions())
    }
  }

  getOptions() {
    return ConfigFacade.get(ConfigurationKeys.Middleware.corsOptions, {})
  }

  getClassName() {
    return ExpressCorsMiddleware.className
  }

  before(request: Express.Request, response: Express.Response) {
    return new Promise(function(resolve: any, reject: any) {
      CorsEnable(request, response, function(error: any) {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    })
  }
}
register(ExpressCorsMiddleware)
