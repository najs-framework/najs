import { IRouteBuilder } from './interfaces/IRouteBuilder'
import { IRouteData } from './interfaces/IRouteData'

export class RouteCollection {
  static routes: Array<IRouteBuilder> = []

  static getData(): Array<IRouteData> {
    return []
  }

  static has() {}
}
