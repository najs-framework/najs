import { IAutoload } from '../../core/IAutoload'
import { IRequestRetriever } from '../request/IRequestRetriever'
import { IncomingMessage, ServerResponse } from 'http'

export abstract class Controller<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> implements IAutoload {
  protected request: Request
  protected response: Response
  protected input: IRequestRetriever

  public constructor(request: Request, response: Response) {
    this.request = request
    this.response = response
  }

  abstract getClassName(): string
}
