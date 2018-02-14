import { IAutoload } from '../../core/IAutoload'
import { IRequestRetriever } from '../request/IRequestRetriever'
import { IncomingMessage, ServerResponse } from 'http'

export abstract class Controller<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> implements IAutoload {
  public request: Request
  public response: Response
  public input: IRequestRetriever

  public constructor(request: Request, response: Response) {
    this.request = request
    this.response = response
  }

  abstract getClassName(): string
}
