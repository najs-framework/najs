import { IAutoload } from 'najs-binding'
import { IRequestDataReader } from '../request/IRequestDataReader'
import { ISession } from '../session/ISession'
import { IncomingMessage, ServerResponse } from 'http'

export abstract class Controller<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> implements IAutoload {
  public request: Request
  public response: Response
  public input: IRequestDataReader
  public session: ISession

  public constructor(request: Request, response: Response) {
    this.request = request
    this.response = response
  }

  abstract getClassName(): string
}
