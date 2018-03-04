import { IAutoload } from 'najs-binding'
import { IRequestDataReader } from '../request/IRequestDataReader'
import { ISession } from '../session/ISession'
import { ICookie } from '../cookie/ICookie'
import { IAuth } from '../../auth/interfaces/IAuth'
import { IncomingMessage, ServerResponse } from 'http'

export abstract class Controller<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> implements IAutoload {
  public request: Request
  public response: Response
  public input: IRequestDataReader
  public auth: IAuth
  public session: ISession
  public cookie: ICookie

  public constructor(request: Request, response: Response) {
    this.request = request
    this.response = response
  }

  abstract getClassName(): string
}
