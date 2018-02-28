import { ConfigFacade } from '../../facades/global/ConfigFacade'
import { ConfigurationKeys } from './../../constants'
import { IAutoload } from 'najs-binding'
import { IExpressMiddleware } from './IExpressMiddleware'
import { register } from 'najs-binding'
import { ViewResponse } from '../response/types/ViewResponse'
import * as Csurf from 'csurf'
import * as Express from 'express'

export let CsurfProtection: Express.RequestHandler

export class ExpressCsurfMiddleware implements IExpressMiddleware, IAutoload {
  static className: string = 'Najs.ExpressCsurfMiddleware'

  constructor() {
    if (!CsurfProtection) {
      CsurfProtection = Csurf(this.getOptions())
    }
  }

  getOptions() {
    return ConfigFacade.get(ConfigurationKeys.Middleware.csurfOptions, { cookie: true })
  }

  getClassName() {
    return ExpressCsurfMiddleware.className
  }

  before(request: Express.Request, response: Express.Response) {
    return new Promise(function(resolve: any, reject: any) {
      CsurfProtection(request, response, function(error: any) {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    })
  }

  async after(request: Express.Request, response: Express.Response, result: any) {
    if (result instanceof ViewResponse) {
      const token = request.csrfToken()
      result
        .with('csrfToken', token)
        .with('CsrfToken', token)
        .with('csrf_token', token)
        .with('CSRF_TOKEN', token)
    }
    return result
  }
}
register(ExpressCsurfMiddleware)
