import { IRouteBuilder } from './interfaces/IRouteBuilder'
import { RouteCollection } from './RouteCollection'
import { RouteBuilder } from './RouteBuilder'
import {
  RouteGrammarVerbChain,
  RouteGrammarGroupChain,
  RouteGrammarControlChain,
  RouteGrammarNameChain
} from './interfaces/IRouteGrammars'
import { IMiddleware } from '../middleware/IMiddleware'
import { HttpMethod } from '../HttpMethod'
import { Controller } from '../controller/Controller'

export class Router {
  // redirect(...args: Array<any>): void {}

  group(callback: () => void): RouteGrammarGroupChain {
    return this.register<RouteBuilder>(new RouteBuilder()).group(callback)
  }

  use(middleware: string): RouteGrammarControlChain
  use(middleware: IMiddleware): RouteGrammarControlChain
  use(middleware: Function): RouteGrammarControlChain
  use(middleware: string[]): RouteGrammarControlChain
  use(middleware: IMiddleware[]): RouteGrammarControlChain
  use(middleware: Function[]): RouteGrammarControlChain
  use(
    ...middleware: Array<string | string[] | IMiddleware | IMiddleware[] | Function | Function[]>
  ): RouteGrammarControlChain
  use(...list: Array<any>): RouteGrammarControlChain {
    return this.register<RouteBuilder>(new RouteBuilder()).use(...list)
  }

  middleware(middleware: string): RouteGrammarControlChain
  middleware(middleware: IMiddleware): RouteGrammarControlChain
  middleware(middleware: Function): RouteGrammarControlChain
  middleware(middleware: string[]): RouteGrammarControlChain
  middleware(middleware: IMiddleware[]): RouteGrammarControlChain
  middleware(middleware: Function[]): RouteGrammarControlChain
  middleware(
    ...middleware: Array<string | string[] | IMiddleware | IMiddleware[] | Function | Function[]>
  ): RouteGrammarControlChain
  middleware(...list: Array<any>): RouteGrammarControlChain {
    return this.register<RouteBuilder>(new RouteBuilder()).middleware(...list)
  }

  prefix(prefix: string): RouteGrammarControlChain {
    return this.register<RouteBuilder>(new RouteBuilder()).prefix(prefix)
  }

  name(name: string): RouteGrammarNameChain {
    return this.register<RouteBuilder>(new RouteBuilder()).name(name)
  }

  method(method: HttpMethod | 'all', path: string, target: string): RouteGrammarVerbChain
  method(method: HttpMethod | 'all', path: string, endpoint: Function): RouteGrammarVerbChain
  method(method: HttpMethod | 'all', path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  method(method: HttpMethod | 'all', path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  method(arg0: any, arg1: any, arg2: any, arg3?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).method(arg0, arg1, arg2, arg3)
  }

  all(path: string, target: string): RouteGrammarVerbChain
  all(path: string, endpoint: Function): RouteGrammarVerbChain
  all(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  all(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  all(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).all(arg0, arg1, arg2)
  }

  checkout(path: string, target: string): RouteGrammarVerbChain
  checkout(path: string, endpoint: Function): RouteGrammarVerbChain
  checkout(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  checkout(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  checkout(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).checkout(arg0, arg1, arg2)
  }

  copy(path: string, target: string): RouteGrammarVerbChain
  copy(path: string, endpoint: Function): RouteGrammarVerbChain
  copy(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  copy(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  copy(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).copy(arg0, arg1, arg2)
  }

  delete(path: string, target: string): RouteGrammarVerbChain
  delete(path: string, endpoint: Function): RouteGrammarVerbChain
  delete(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  delete(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  delete(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).delete(arg0, arg1, arg2)
  }

  get(path: string, target: string): RouteGrammarVerbChain
  get(path: string, endpoint: Function): RouteGrammarVerbChain
  get(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  get(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  get(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).get(arg0, arg1, arg2)
  }

  head(path: string, target: string): RouteGrammarVerbChain
  head(path: string, endpoint: Function): RouteGrammarVerbChain
  head(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  head(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  head(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).head(arg0, arg1, arg2)
  }

  lock(path: string, target: string): RouteGrammarVerbChain
  lock(path: string, endpoint: Function): RouteGrammarVerbChain
  lock(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  lock(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  lock(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).lock(arg0, arg1, arg2)
  }

  merge(path: string, target: string): RouteGrammarVerbChain
  merge(path: string, endpoint: Function): RouteGrammarVerbChain
  merge(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  merge(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  merge(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).merge(arg0, arg1, arg2)
  }

  mkactivity(path: string, target: string): RouteGrammarVerbChain
  mkactivity(path: string, endpoint: Function): RouteGrammarVerbChain
  mkactivity(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  mkactivity(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  mkactivity(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).mkactivity(arg0, arg1, arg2)
  }

  mkcol(path: string, target: string): RouteGrammarVerbChain
  mkcol(path: string, endpoint: Function): RouteGrammarVerbChain
  mkcol(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  mkcol(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  mkcol(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).mkcol(arg0, arg1, arg2)
  }

  move(path: string, target: string): RouteGrammarVerbChain
  move(path: string, endpoint: Function): RouteGrammarVerbChain
  move(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  move(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  move(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).move(arg0, arg1, arg2)
  }

  msearch(path: string, target: string): RouteGrammarVerbChain
  msearch(path: string, endpoint: Function): RouteGrammarVerbChain
  msearch(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  msearch(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  msearch(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).msearch(arg0, arg1, arg2)
  }

  notify(path: string, target: string): RouteGrammarVerbChain
  notify(path: string, endpoint: Function): RouteGrammarVerbChain
  notify(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  notify(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  notify(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).notify(arg0, arg1, arg2)
  }

  options(path: string, target: string): RouteGrammarVerbChain
  options(path: string, endpoint: Function): RouteGrammarVerbChain
  options(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  options(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  options(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).options(arg0, arg1, arg2)
  }

  patch(path: string, target: string): RouteGrammarVerbChain
  patch(path: string, endpoint: Function): RouteGrammarVerbChain
  patch(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  patch(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  patch(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).patch(arg0, arg1, arg2)
  }

  post(path: string, target: string): RouteGrammarVerbChain
  post(path: string, endpoint: Function): RouteGrammarVerbChain
  post(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  post(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  post(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).post(arg0, arg1, arg2)
  }

  purge(path: string, target: string): RouteGrammarVerbChain
  purge(path: string, endpoint: Function): RouteGrammarVerbChain
  purge(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  purge(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  purge(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).purge(arg0, arg1, arg2)
  }

  put(path: string, target: string): RouteGrammarVerbChain
  put(path: string, endpoint: Function): RouteGrammarVerbChain
  put(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  put(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  put(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).put(arg0, arg1, arg2)
  }

  report(path: string, target: string): RouteGrammarVerbChain
  report(path: string, endpoint: Function): RouteGrammarVerbChain
  report(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  report(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  report(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).report(arg0, arg1, arg2)
  }

  search(path: string, target: string): RouteGrammarVerbChain
  search(path: string, endpoint: Function): RouteGrammarVerbChain
  search(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  search(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  search(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).search(arg0, arg1, arg2)
  }

  subscribe(path: string, target: string): RouteGrammarVerbChain
  subscribe(path: string, endpoint: Function): RouteGrammarVerbChain
  subscribe(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  subscribe(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  subscribe(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).subscribe(arg0, arg1, arg2)
  }

  trace(path: string, target: string): RouteGrammarVerbChain
  trace(path: string, endpoint: Function): RouteGrammarVerbChain
  trace(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  trace(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  trace(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).trace(arg0, arg1, arg2)
  }

  unlock(path: string, target: string): RouteGrammarVerbChain
  unlock(path: string, endpoint: Function): RouteGrammarVerbChain
  unlock(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  unlock(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  unlock(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).unlock(arg0, arg1, arg2)
  }

  unsubscribe(path: string, target: string): RouteGrammarVerbChain
  unsubscribe(path: string, endpoint: Function): RouteGrammarVerbChain
  unsubscribe(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  unsubscribe(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  unsubscribe(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).unsubscribe(arg0, arg1, arg2)
  }

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
