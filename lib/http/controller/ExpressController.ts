import { Log } from './../../facades/global/LogFacade'
import { MemberProxy } from './MemberProxy'
import { IAutoloadMetadata } from 'najs-binding'
import { Controller } from './Controller'
import { IRequestDataReader } from '../request/IRequestDataReader'
import { Request, Response } from 'express'
import { RequestDataReader } from '../request/RequestDataReader'
import { Input } from '../../facades/contextual/InputContextualFacade'

export type RequestIdAutoloadMetadata = {
  readonly requestId: string
}

const SessionWarningMessage = 'Please use SessionMiddleware if you are using this.session.{{key}}() in controller'
const SessionProxySetting = {
  get(path: string, defaultValue: any) {
    Log.warning(SessionWarningMessage.replace('{{key}}', 'get'))
    return defaultValue
  },
  chainable: ['set', 'put', 'push', 'pull', 'delete', 'remove', 'forget', 'clear', 'flush', 'flash', 'reflash', 'keep'],
  returnFalse: ['has', 'exists'],
  returnEmptyObject: ['all', 'only', 'except'],
  returnPromiseUndefined: ['regenerate']
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
    this.session = <any>new MemberProxy(SessionWarningMessage, SessionProxySetting)
    this.__autoloadMetadata = {
      requestId: request['id']
    }
  }
}
