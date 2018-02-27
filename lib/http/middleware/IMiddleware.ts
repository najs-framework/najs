import { IHttpDriver } from '../driver/IHttpDriver'

export interface IMiddleware {
  native?(driver: IHttpDriver): void
  before?(request: any, response: any): Promise<any>
  after?(request: any, response: any, result: any, controller: any): Promise<any>
}
