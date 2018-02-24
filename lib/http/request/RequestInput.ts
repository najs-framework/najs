import { IAutoload, register } from 'najs-binding'
import { Controller } from '../controller/Controller'
import { ExpressController } from '../controller/ExpressController'
import { ContextualFacade } from 'najs-facade'
import { ContextualFacadeClass } from '../../constants'
import { RequestData } from './RequestData'
import { IRequestRetriever } from './IRequestRetriever'
import { HttpMethod } from '../HttpMethod'
import * as Express from 'express'

export class RequestInput extends ContextualFacade<Controller> implements IRequestRetriever, IAutoload {
  protected data: Object
  readonly method: HttpMethod

  constructor(controller: Controller) {
    super(controller)
    controller.input = this
    if (controller instanceof ExpressController) {
      this.createInputFromExpressController()
    }
  }

  getClassName() {
    return ContextualFacadeClass.Input
  }

  protected createInputFromExpressController() {
    const request: Express.Request = (this.context as ExpressController).request
    switch (request.method.toUpperCase()) {
      case HttpMethod.GET:
        this.data = Object.assign({}, request.query, request.params)
        break

      case HttpMethod.PATCH:
      case HttpMethod.PUT:
      case HttpMethod.POST:
      case HttpMethod.PURGE:
      case HttpMethod.DELETE:
        this.data = Object.assign({}, request.params, request.body)
        break

      default:
        this.data = Object.assign({}, request.query, request.params, request.body)
        break
    }
  }

  get<T extends any>(name: string): T
  get<T extends any>(name: string, defaultValue: T): T
  get<T extends any>(name: string, defaultValue?: T): T {
    return RequestData.prototype.get.apply(this, arguments)
  }

  has(name: string): boolean {
    return RequestData.prototype.has.apply(this, arguments)
  }

  all(): Object {
    return RequestData.prototype.all.apply(this, arguments)
  }

  only(name: string): Object
  only(names: string[]): Object
  only(...args: Array<string | string[]>): Object
  only(...args: Array<string | string[]>): Object {
    return RequestData.prototype.only.apply(this, arguments)
  }

  except(name: string): Object
  except(names: string[]): Object
  except(...args: Array<string | string[]>): Object
  except(...args: Array<string | string[]>): Object {
    return RequestData.prototype.except.apply(this, arguments)
  }
}
register(RequestInput)
