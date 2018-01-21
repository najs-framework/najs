import { IRouteBuilder } from './interfaces/IRouteBuilder'
import { IRouteData } from './interfaces/IRouteData'
import { flatten } from 'lodash'

export class RouteCollection {
  static routes: IRouteBuilder[] = []

  static getData(): IRouteData[] {
    const result: IRouteData[][] = this.routes.map(route => route.getRouteData())
    return flatten(result)
  }

  // static has() {}
}
