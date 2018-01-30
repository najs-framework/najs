import { IRouteBuilder } from './interfaces/IRouteBuilder'
import { IRouteData } from './interfaces/IRouteData'
import { flatten } from 'lodash'

// type RoutingOptions = {
//   duplicatedNameWarning: boolean
// }

// const DEFAULT_ROUTING_OPTIONS: RoutingOptions = {
//   duplicatedNameWarning: true
// }

export class RouteCollection {
  // private static options: RoutingOptions = DEFAULT_ROUTING_OPTIONS
  private static isChanged: boolean = false
  private static routes: IRouteBuilder[] = []
  private static routeData: IRouteData[] = []
  private static routeDataNamed: {
    [key: string]: IRouteData
  } = {}

  static getData(): IRouteData[] {
    if (this.isChanged) {
      const result: IRouteData[][] = this.routes.map(route => route.getRouteData())
      this.routeData = flatten(result)
      this.routeDataNamed = this.routeData.reduce((memo, item) => {
        if (item.name) {
          // if (typeof memo[item.name] !== 'undefined' && this.options.duplicatedNameWarning) {
          // Logger.warn('Duplicated named')
          // }
          memo[item.name] = item
        }
        return memo
      }, {})
      this.isChanged = false
    }
    return this.routeData
  }

  static register<T extends IRouteBuilder>(route: T): T {
    this.isChanged = true
    if (this.routes.length === 0) {
      this.routes.push(route)
      return route
    }

    const lastRoute = this.routes[this.routes.length - 1]
    if (lastRoute.shouldRegisterChildRoute()) {
      lastRoute.registerChildRoute(route)
      return route
    }

    this.routes.push(route)
    return route
  }

  static hasName(name: string) {
    return typeof this.routeDataNamed[name] !== 'undefined'
  }

  static findOrFail(name: string): IRouteData {
    this.getData()
    if (!this.hasName(name)) {
      throw new Error('Route "' + name + '" not found')
    }
    return this.routeDataNamed[name]
  }

  // static setOptions(options: Partial<RoutingOptions>) {
  //   this.options = Object.assign({}, DEFAULT_ROUTING_OPTIONS, options)
  // }
}
