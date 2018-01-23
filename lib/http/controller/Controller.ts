import { IAutoload } from '../../core/IAutoload'
import { IncomingMessage, ServerResponse } from 'http'
// import { ExpressController } from './ExpressController'

export abstract class Controller<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> implements IAutoload {
  // static Express: typeof ExpressController = ExpressController

  protected request: Request
  protected response: Response

  public constructor(request: Request, response: Response) {
    this.request = request
    this.response = response
  }

  abstract getClassName(): string
}
