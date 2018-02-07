import { IAutoload } from '../../core/IAutoload'
import { IExpressMiddleware } from './IExpressMiddleware'
import { register } from '../../core/register'

export class ExpressAjvValidatorMiddleware implements IExpressMiddleware, IAutoload {
  static className: string = 'ExpressAjvValidatorMiddleware'

  getClassName() {
    return ExpressAjvValidatorMiddleware.className
  }

  async before(request: Express.Request, response: Express.Response) {}

  async after(request: Express.Request, response: Express.Response, result: any) {}
}
register(ExpressAjvValidatorMiddleware)
