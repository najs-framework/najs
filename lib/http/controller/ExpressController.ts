import { IAutoloadMetadata } from 'najs-binding'
import { Controller } from './Controller'
import { IRequestDataReader } from '../request/IRequestDataReader'
import { Request, Response } from 'express'
import { RequestDataReader } from '../request/RequestDataReader'
import { Input } from '../../facades/contextual/InputContextualFacade'

export type RequestIdAutoloadMetadata = {
  readonly requestId: string
}

export abstract class ExpressController extends Controller<Request, Response>
  implements IAutoloadMetadata<RequestIdAutoloadMetadata> {
  __autoloadMetadata: RequestIdAutoloadMetadata
  protected body: IRequestDataReader
  protected query: IRequestDataReader
  protected params: IRequestDataReader

  constructor(request: Request, response: Response) {
    super(request, response)
    this.body = new RequestDataReader(request.body || {})
    this.params = new RequestDataReader(request.params || {})
    this.query = new RequestDataReader(request.query || {})
    this.input = Input.of(this)
    this.__autoloadMetadata = {
      requestId: request['id']
    }
  }
}
