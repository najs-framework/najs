import { IExpressMiddleware } from './IExpressMiddleware'
import { register } from 'najs-binding'
import { ExpressController } from '../controller/ExpressController'
import { HandlebarsViewResponse } from '../../view/handlebars/HandlebarsViewResponse'
import { HandlebarsHelper } from '../../view/handlebars/HandlebarsHelper'
import { CookieHandlebarsHelper } from '../../view/handlebars/helpers/CookieHandlebarsHelper'

export class CookieMiddleware implements IExpressMiddleware {
  static className: string = 'Najs.CookieMiddleware'

  async after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController) {
    if (result instanceof HandlebarsViewResponse) {
      result.helper('Cookie', HandlebarsHelper.create(CookieHandlebarsHelper, controller))
    }
    return result
  }
}
register(CookieMiddleware)
