import { IRouteBuilder } from './interfaces/IRouteBuilder'
import { RouteCollection } from './RouteCollection'
import { RouteBuilder } from './RouteBuilder'
import {
  RouteGrammarVerbChain,
  RouteGrammarGroupChain,
  RouteGrammarControlChain,
  RouteGrammarNameChain
} from './interfaces/IRouteGrammars'

export class Router {
  group(callback: () => void): RouteGrammarGroupChain {
    return this.register<RouteBuilder>(new RouteBuilder('', '')).group(callback)
  }

  use(middleware: string): RouteGrammarControlChain {
    return this.register<RouteBuilder>(new RouteBuilder('', '')).use(middleware)
  }

  middleware(middleware: string): RouteGrammarControlChain {
    return this.register<RouteBuilder>(new RouteBuilder('', '')).middleware(middleware)
  }

  prefix(prefix: string): RouteGrammarControlChain {
    return this.register<RouteBuilder>(new RouteBuilder('', '')).prefix(prefix)
  }

  get(path: string, endpoint: string): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder('GET', path))
  }

  name(name: string): RouteGrammarNameChain {
    return this.register<RouteBuilder>(new RouteBuilder('', '')).name(name)
  }

  redirect(...args: Array<any>): void {}

  private register<T extends IRouteBuilder>(route: T): T {
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
