import { IRouteData } from './IRouteData'

export interface IRoute {
  getRouteData(): IRouteData | Array<IRouteData | undefined> | undefined
  hasChildRoute(): boolean
  registerChildRoute(route: IRoute): void
  shouldRegisterChildRoute(): boolean
}
