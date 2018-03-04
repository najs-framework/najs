import { ContextualFacadeClass } from './../../constants'
import { IAutoload } from 'najs-binding'
import { ContextualFacade } from 'najs-facade'
// import { ICookie } from './ICookie'
import { Controller } from '../controller/Controller'
import { ExpressController } from '../controller/ExpressController'
import { Request, Response } from 'express'

export class Cookie extends ContextualFacade<Controller> implements IAutoload {
  protected data: Object
  protected cookies: Object
  protected signedCookies: Object

  constructor(controller: Controller) {
    super(controller)
    controller.cookie = <any>this
    if (controller instanceof ExpressController) {
      const request: Request = (controller as ExpressController).request
      this.data = Object.assign({}, request.cookies, request.signedCookies)
      this.cookies = request.cookies
      this.signedCookies = request.signedCookies
    }
  }

  getClassName() {
    return ContextualFacadeClass.Session
  }

  protected getResponse(): Response {
    return (this.context as ExpressController).response
  }
}
