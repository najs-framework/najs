import { register } from 'najs-binding'
import { IExpressMiddleware } from './IExpressMiddleware'
import { ExpressController } from '../controller/ExpressController'
import { HandlebarsViewResponse } from '../../view/handlebars/HandlebarsViewResponse'
import { HandlebarsHelper } from '../../view/handlebars/HandlebarsHelper'
import { CookieHandlebarsHelper } from '../../view/handlebars/helpers/CookieHandlebarsHelper'
import { ConfigFacade } from '../../facades/global/ConfigFacade'
import { ConfigurationKeys } from '../../constants'
import * as Express from 'express'
import * as CookieParserNative from 'cookie-parser'

export let CookieParser: Express.RequestHandler

export class CookieMiddleware implements IExpressMiddleware {
  static className: string = 'Najs.CookieMiddleware'

  constructor() {
    if (!CookieParser) {
      CookieParser = CookieParserNative(this.getSecret(), this.getOptions())
    }
  }

  protected getSecret(): string {
    return ConfigFacade.get(ConfigurationKeys.Cookie.secret, 'najs')
  }

  protected getOptions(): Object {
    return ConfigFacade.get(ConfigurationKeys.Cookie.options, {})
  }

  before(request: Express.Request, response: Express.Response) {
    return new Promise(function(resolve: any, reject: any) {
      CookieParser(request, response, function(error: any) {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    })
  }

  async after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController) {
    if (result instanceof HandlebarsViewResponse) {
      result.helper('Cookie', HandlebarsHelper.create(CookieHandlebarsHelper, controller))
    }
    return result
  }
}
register(CookieMiddleware)
