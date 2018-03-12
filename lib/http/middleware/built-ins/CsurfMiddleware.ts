import { ConfigFacade } from '../../../facades/global/ConfigFacade'
import { ConfigurationKeys } from '../../../constants'
import { IAutoload } from 'najs-binding'
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase'
import { register } from 'najs-binding'
import { ViewResponse } from '../../response/types/ViewResponse'
import * as Csurf from 'csurf'
import * as Express from 'express'

export let CsurfProtection: Express.RequestHandler

export class CsurfMiddleware extends ExpressMiddlewareBase implements IAutoload {
  static className: string = 'Najs.CsurfMiddleware'

  getOptions() {
    return ConfigFacade.get(ConfigurationKeys.Middleware.csurfOptions, { cookie: true })
  }

  getClassName() {
    return CsurfMiddleware.className
  }

  createMiddleware(): Express.Handler | Express.Handler[] | undefined {
    if (!CsurfProtection) {
      CsurfProtection = Csurf(this.getOptions())
    }
    return CsurfProtection
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
register(CsurfMiddleware)
