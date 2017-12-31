import { IRoute } from './IRoute'
import { RouteCollection } from './RouteCollection'
import { RouteBuilder } from '../private/RouteBuilder'
import { RouteBuilderAdvance } from '../private/RouteBuilderAdvance'

export class Route {
  static group(callback: () => void): void {
    // do nothing with group in Route
    callback.call(undefined)
  }

  static middleware(middleware: string): RouteBuilderAdvance {
    return this.register<RouteBuilderAdvance>(new RouteBuilderAdvance('', '')).middleware(middleware)
  }

  static prefix(prefix: string): RouteBuilderAdvance {
    return this.register<RouteBuilderAdvance>(new RouteBuilderAdvance('', '')).prefix(prefix)
  }

  static redirect(...args: Array<any>): void {}

  static get(path: string): RouteBuilder {
    return this.register<RouteBuilder>(new RouteBuilder('GET', path))
  }

  static post(path: string): RouteBuilder {
    return this.register<RouteBuilder>(new RouteBuilder('POST', path))
  }

  private static register<T extends IRoute>(route: T): T {
    if (RouteCollection.routes.length === 0) {
      RouteCollection.routes.push(route)
      return route
    }

    const lastRoute = RouteCollection.routes[RouteCollection.routes.length - 1]
    if (lastRoute.shouldRegisterChildRoute()) {
      lastRoute.registerChildRoute(route)
      return route
    }

    RouteCollection.routes.push(route)
    return route
  }
}
