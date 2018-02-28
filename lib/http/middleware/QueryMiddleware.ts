import { IExpressMiddleware } from './IExpressMiddleware'
import { register } from 'najs-binding'
import { ExpressController } from '../controller/ExpressController'
import { HandlebarsViewResponse } from '../../view/handlebars/HandlebarsViewResponse'
import { HandlebarsHelper } from '../../view/handlebars/HandlebarsHelper'
import { RequestDataReaderHandlebarsHelper } from '../../view/handlebars/helpers/RequestDataReaderHandlebarsHelper'

export class QueryMiddleware implements IExpressMiddleware {
  static className: string = 'Najs.QueryMiddleware'

  async after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController) {
    if (result instanceof HandlebarsViewResponse) {
      result.helper('Query', HandlebarsHelper.create(<any>RequestDataReaderHandlebarsHelper, controller, 'query'))
    }
    return result
  }
}
register(QueryMiddleware)
