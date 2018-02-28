import { IExpressMiddleware } from './IExpressMiddleware'
import { register } from 'najs-binding'
import { ExpressController } from '../controller/ExpressController'
import { HandlebarsViewResponse } from '../../view/handlebars/HandlebarsViewResponse'
import { HandlebarsHelper } from '../../view/handlebars/HandlebarsHelper'
import { SessionHandlebarsHelper } from '../../view/handlebars/helpers/SessionHandlebarsHelper'

export class SessionMiddleware implements IExpressMiddleware {
  static className: string = 'Najs.SessionMiddleware'

  async after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController) {
    if (result instanceof HandlebarsViewResponse) {
      result.helper('Session', HandlebarsHelper.create(SessionHandlebarsHelper, controller))
    }
    return result
  }
}
register(SessionMiddleware)
