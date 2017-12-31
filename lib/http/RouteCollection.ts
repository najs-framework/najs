import { IRoute } from './IRoute'
import { IRouteData } from './IRouteData'

export class RouteCollection {
  static routes: Array<IRoute> = []

  static getData(): Array<IRouteData> {
    return []
  }

  static has() {}
}
