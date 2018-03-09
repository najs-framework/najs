// import { HandlebarsViewResponse } from './../../view/handlebars/HandlebarsViewResponse'
import { IExpressMiddleware } from './IExpressMiddleware'
import { Request, Response } from 'express'
import { ExpressController } from '../../http/controller/ExpressController'
import { AuthContextualFacade } from './../../facades/contextual/AuthContextualFacade'

export class AuthMiddleware implements IExpressMiddleware {
  static className: string = 'Najs.AuthMiddleware'

  protected guard: string | undefined

  constructor(guard?: string) {
    this.guard = guard
  }

  async before(request: Request, response: Response, controller: ExpressController) {
    const auth = AuthContextualFacade.from(controller)
    if (this.guard) {
      auth.guard(this.guard)
    }
  }

  // async after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController) {
  //   if (result instanceof HandlebarsViewResponse) {
  //     // result.helper('Session', HandlebarsHelper.create(SessionHandlebarsHelper, controller))
  //   }
  //   return result
  // }
}
