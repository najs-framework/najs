import { IRouteData } from '../routing/interfaces/IRouteData'

export type HttpDriverStartOptions = {
  port?: number
  host?: any
}

export interface IHttpDriver<T = any> {
  getNativeDriver(): T

  start(options: HttpDriverStartOptions): void

  route(data: IRouteData): void

  respondJson(response: any, value: any): void
  respondRedirect(response: any, path: string, code: number): void
}
