import { IRouteData } from '../routing/interfaces/IRouteData'

export type HttpDriverSetupFunction<T> = () => T
export type HttpDriverDidSetupHandler<T> = (instance: T) => void
export type HttpDriverStartOptions = {
  port: number
  host: any
}

export interface IHttpDriver<T = any> {
  getNativeDriver(): T

  initialize(): void

  route(data: IRouteData): void

  setup(setupFunction: HttpDriverSetupFunction<T>): this

  driverDidSetup(handler: HttpDriverDidSetupHandler<T>): this

  respondJson(response: any, value: any): void
  respondRedirect(response: any, path: string, code: number): void

  start(options: HttpDriverStartOptions): void
}
