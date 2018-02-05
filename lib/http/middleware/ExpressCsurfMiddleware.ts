import { ConfigurationKeys } from './../../constants'
import { IAutoload } from '../../core/IAutoload'
import { IExpressMiddleware } from './IExpressMiddleware'
import { ViewResponse } from '../response/types/ViewResponse'
import { register } from '../../core/register'
import * as Csurf from 'csurf'
import * as Express from 'express'
import { NajsFacade } from '../../core/NajsFacade'

export let CsurfProtection: Express.RequestHandler

export class ExpressCsurfMiddleware implements IExpressMiddleware, IAutoload {
  static className: string = 'ExpressCsurfMiddleware'

  constructor() {
    if (!CsurfProtection) {
      CsurfProtection = Csurf(this.getOptions())
    }
  }

  getOptions() {
    return NajsFacade.getConfig(ConfigurationKeys.Middleware.csurfOptions, { cookie: true })
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
