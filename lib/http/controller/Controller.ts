/// <reference path="../../contracts/types/http.ts" />
/// <reference path="../../contracts/Cookie.ts" />

import { IRequestDataReader } from '../request/IRequestDataReader'
import { ISession } from '../session/ISession'
import { IAuth } from '../../auth/interfaces/IAuth'
import { IncomingMessage, ServerResponse } from 'http'

export abstract class Controller<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> implements Najs.Http.IController {
  public request: Request
  public response: Response
  public input: IRequestDataReader
  public auth: IAuth
  public session: ISession
  public cookie: Najs.Contracts.Cookie

  public constructor(request: Request, response: Response) {
    this.request = request
    this.response = response
  }

  abstract getClassName(): string
}
