import { IHttpDriver } from '../driver/IHttpDriver'

export interface IMiddleware {
  // appLevelMiddleware?(request: any, response: any, next: Function): void
  // routeLevelMiddleware?(request: any, response: any, next: Function): void
  native?(driver: IHttpDriver): void
  before?(request: any, response: any, controller: any): Promise<any>
  after?(request: any, response: any, result: any, controller: any): Promise<any>
}
