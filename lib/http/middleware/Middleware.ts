import { IMiddleware } from './IMiddleware'

export class Middleware implements IMiddleware {
  async before(request: any): Promise<any> {}

  async after(request: any, response: any): Promise<any> {}
}
