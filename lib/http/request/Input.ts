import { ExpressController } from '../controller/ExpressController'
import { ContextualFacade } from '../../facades/ContextualFacade'
import { RequestData } from './RequestData'
import { IRequestRetriever } from './IRequestRetriever'
import { HttpMethod } from '../HttpMethod'

export class Input extends ContextualFacade<ExpressController> implements IRequestRetriever {
  protected data: Object
  readonly body: Object
  readonly query: Object
  readonly params: Object
  readonly method: HttpMethod

  constructor(controller: ExpressController) {
    super(controller)
    controller.input = this
    this.body = controller.request.body
    this.query = controller.request.query
    this.params = controller.request.params
    this.method = <HttpMethod>controller.request.method.toUpperCase()
  }

  protected buildData() {
    switch (this.method) {
      case HttpMethod.GET:
        this.data = Object.assign({}, this.query, this.params)
        break

      case HttpMethod.PATCH:
      case HttpMethod.PUT:
      case HttpMethod.POST:
      case HttpMethod.PURGE:
      case HttpMethod.DELETE:
        this.data = Object.assign({}, this.params, this.body)
        break

      default:
        this.data = Object.assign({}, this.query, this.params, this.body)
        break
    }
  }

  setData(data: Object) {
    this.data = data
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
