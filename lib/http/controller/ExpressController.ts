import { Controller } from './Controller'
import { IRequestRetriever } from '../request/IRequestRetriever'
import { Request, Response } from 'express'
import { RequestData } from '../request/RequestData'
import { Input } from '../../facades/contextual/InputContextualFacade'

export abstract class ExpressController extends Controller<Request, Response> {
  protected body: IRequestRetriever
  protected query: IRequestRetriever
  protected params: IRequestRetriever

  constructor(request: Request, response: Response) {
    super(request, response)
    this.body = new RequestData(request.body || {})
    this.params = new RequestData(request.params || {})
    this.query = new RequestData(request.query || {})
    this.input = Input.of(this)
  }
}
