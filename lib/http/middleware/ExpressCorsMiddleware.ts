import { NajsFacade } from '../../core/NajsFacade'
import { ConfigurationKeys } from '../../constants'
import { IAutoload } from '../../core/IAutoload'
import { IExpressMiddleware } from './IExpressMiddleware'
import { register } from '../../core/register'
import * as Express from 'express'
import * as CORS from 'cors'

export let CorsEnable: Express.RequestHandler

export class ExpressCorsMiddleware implements IExpressMiddleware, IAutoload {
  static className: string = 'ExpressCorsMiddleware'

  constructor() {
    if (!CorsEnable) {
      CorsEnable = CORS(this.getOptions())
    }
  }

  getOptions() {
    return NajsFacade.getConfig(ConfigurationKeys.Middleware.corsOptions, {})
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
