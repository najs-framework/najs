/// <reference path="../../contracts/types/http.ts" />

import { Log } from '../../facades/global/LogFacade'
import { MemberProxy } from './MemberProxy'
import { Controller } from './Controller'
import { Request, Response } from 'express'
import { RequestDataReader } from '../request/RequestDataReader'
import { Input } from '../../facades/contextual/InputContextualFacade'
import { CookieContextualFacade } from '../../facades/contextual/CookieContextualFacade'
import { SessionContextualFacade } from '../../facades/contextual/SessionContextualFacade'

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

const CookieWarningMessage = 'Please use CookieMiddleware if you are using this.cookie.{{key}}() in controller'
const CookieProxySetting = {
  get(path: string, defaultValue: any) {
    Log.warning(CookieWarningMessage.replace('{{key}}', 'get'))
    return defaultValue
  },
  chainable: ['forget', 'make', 'forever'],
  returnFalse: ['isSigned', 'has', 'exists'],
  returnEmptyObject: ['all', 'only', 'except']
}

export abstract class ExpressController extends Controller {
  __autoloadMetadata: RequestIdAutoloadMetadata
  protected body: Najs.Http.IRequestDataReader
  protected query: Najs.Http.IRequestDataReader
  protected params: Najs.Http.IRequestDataReader
  public request: Request
  public response: Response

  constructor(request: Request, response: Response) {
    super(request, response)
    this.body = new RequestDataReader(request.body || {})
    this.params = new RequestDataReader(request.params || {})
    this.query = new RequestDataReader(request.query || {})

    this.input = Input.of(this)

    if (this.request.session) {
      this.session = SessionContextualFacade.of(this)
    } else {
      this.session = <any>new MemberProxy(SessionWarningMessage, SessionProxySetting)
    }

    if (this.request.cookies || this.request.signedCookies) {
      this.cookie = CookieContextualFacade.of(this)
    } else {
      this.cookie = <any>new MemberProxy(CookieWarningMessage, CookieProxySetting)
    }

    this.__autoloadMetadata = {
      requestId: request['id']
    }
  }
}
