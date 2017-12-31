import { IRouteData } from './IRouteData'

export type HttpDriverSetupFunction<T = any> = () => T
export type HttpDriverDidSetupHandler<T = any> = (instance: T) => void
export type HttpDriverStartOptions = {
  port: number
  host: any
}

export interface IHttpDriver {
  getDriverName(): string

  initialize(): void

  route(data: IRouteData): void

  setup(setupFunction: HttpDriverSetupFunction): this

  driverDidSetup(handler: HttpDriverDidSetupHandler): this

  respondJson(response: any, value: any): void
  respondRedirect(response: any, path: string, code: number): void

  start(options: HttpDriverStartOptions): void
}
