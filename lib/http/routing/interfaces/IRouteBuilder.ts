import { IRouteData } from './IRouteData'

export interface IRouteBuilder {
  getRouteData(): IRouteData | Array<IRouteData | undefined> | undefined
  hasChildRoute(): boolean
  registerChildRoute(route: IRouteBuilder): void
  shouldRegisterChildRoute(): boolean
}
