import { register } from 'najs-binding'
import { ExpressMiddlewareBase } from './ExpressMiddlewareBase'
import { ExpressController } from '../controller/ExpressController'
import { HandlebarsViewResponse } from '../../view/handlebars/HandlebarsViewResponse'
import { HandlebarsHelper } from '../../view/handlebars/HandlebarsHelper'
import { CookieHandlebarsHelper } from '../../view/handlebars/helpers/CookieHandlebarsHelper'
import { CookieContextualFacade } from './../../facades/contextual/CookieContextualFacade'
import { ConfigFacade } from '../../facades/global/ConfigFacade'
import { ConfigurationKeys } from '../../constants'
import { Controller } from '../../http/controller/Controller'
import * as Express from 'express'
import * as CookieParserNative from 'cookie-parser'

export let CookieParser: Express.RequestHandler

export class CookieMiddleware extends ExpressMiddlewareBase {
  static className: string = 'Najs.CookieMiddleware'

  protected parseIdentify(...args: string[]): string {
    return 'cookie-parser'
  }

  createMiddleware(): Express.Handler | Express.Handler[] | undefined {
    if (!CookieParser) {
      CookieParser = CookieParserNative(this.getSecret(), this.getOptions())
    }
    return CookieParser
  }

  protected getSecret(): string {
    return ConfigFacade.get(ConfigurationKeys.Cookie.secret, 'najs')
  }

  protected getOptions(): Object {
    return ConfigFacade.get(ConfigurationKeys.Cookie.options, {})
  }

  async before(request: Express.Request, response: Express.Response, controller: Controller) {
    CookieContextualFacade.of(controller)
  }

  async after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController) {
    if (result instanceof HandlebarsViewResponse) {
      result.helper('Cookie', HandlebarsHelper.create(CookieHandlebarsHelper, controller))
    }
    return result
  }
}
register(CookieMiddleware)
