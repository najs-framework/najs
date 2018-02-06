import { Controller } from './Controller'
import { IRequestRetriever } from '../request/IRequestRetriever'
import { Request, Response } from 'express'
import { HttpMethod } from '../HttpMethod'
import { RequestData } from '../request/RequestData'

export abstract class ExpressController extends Controller<Request, Response> {
  protected body: IRequestRetriever
  protected query: IRequestRetriever
  protected params: IRequestRetriever

  constructor(request: Request, response: Response) {
    super(request, response)
    this.body = new RequestData(request.body || {})
    this.params = new RequestData(request.params || {})
    this.query = new RequestData(request.query || {})
    this.createInputFromRequest()
  }

  protected createInputFromRequest(): IRequestRetriever {
    let data: Object
    switch (this.request.method.toUpperCase()) {
      case HttpMethod.GET:
        data = Object.assign({}, this.request.query, this.request.params)
        break

      case HttpMethod.PATCH:
      case HttpMethod.PUT:
      case HttpMethod.POST:
      case HttpMethod.PURGE:
      case HttpMethod.DELETE:
        data = Object.assign({}, this.request.params, this.request.body)
        break

      default:
        data = Object.assign({}, this.request.query, this.request.params, this.request.body)
        break
    }
    this.input = new RequestData(data)
    return this.input
  }
}
