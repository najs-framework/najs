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

export class Router {
  group(callback: () => void): RouteGrammarGroupChain {
    return this.register<RouteBuilder>(new RouteBuilder('', '')).group(callback)
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
    return this.register<RouteBuilder>(new RouteBuilder('', '')).use(...list)
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
    return this.register<RouteBuilder>(new RouteBuilder('', '')).middleware(...list)
  }

  prefix(prefix: string): RouteGrammarControlChain {
    return this.register<RouteBuilder>(new RouteBuilder('', '')).prefix(prefix)
  }

  name(name: string): RouteGrammarNameChain {
    return this.register<RouteBuilder>(new RouteBuilder('', '')).name(name)
  }

  redirect(...args: Array<any>): void {}

  checkout(path: string, target: string): RouteGrammarVerbChain
  checkout(path: string, endpoint: Function): RouteGrammarVerbChain
  checkout<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  checkout(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).checkout(arg0, arg1, arg2)
  }

  copy(path: string, target: string): RouteGrammarVerbChain
  copy(path: string, endpoint: Function): RouteGrammarVerbChain
  copy<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  copy(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).copy(arg0, arg1, arg2)
  }

  delete(path: string, target: string): RouteGrammarVerbChain
  delete(path: string, endpoint: Function): RouteGrammarVerbChain
  delete<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  delete(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).delete(arg0, arg1, arg2)
  }

  get(path: string, target: string): RouteGrammarVerbChain
  get(path: string, endpoint: Function): RouteGrammarVerbChain
  get<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  get(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).get(arg0, arg1, arg2)
  }

  head(path: string, target: string): RouteGrammarVerbChain
  head(path: string, endpoint: Function): RouteGrammarVerbChain
  head<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  head(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).head(arg0, arg1, arg2)
  }

  lock(path: string, target: string): RouteGrammarVerbChain
  lock(path: string, endpoint: Function): RouteGrammarVerbChain
  lock<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  lock(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).lock(arg0, arg1, arg2)
  }

  merge(path: string, target: string): RouteGrammarVerbChain
  merge(path: string, endpoint: Function): RouteGrammarVerbChain
  merge<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  merge(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).merge(arg0, arg1, arg2)
  }

  mkactivity(path: string, target: string): RouteGrammarVerbChain
  mkactivity(path: string, endpoint: Function): RouteGrammarVerbChain
  mkactivity<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  mkactivity(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).mkactivity(arg0, arg1, arg2)
  }

  mkcol(path: string, target: string): RouteGrammarVerbChain
  mkcol(path: string, endpoint: Function): RouteGrammarVerbChain
  mkcol<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  mkcol(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).mkcol(arg0, arg1, arg2)
  }

  move(path: string, target: string): RouteGrammarVerbChain
  move(path: string, endpoint: Function): RouteGrammarVerbChain
  move<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  move(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).move(arg0, arg1, arg2)
  }

  msearch(path: string, target: string): RouteGrammarVerbChain
  msearch(path: string, endpoint: Function): RouteGrammarVerbChain
  msearch<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  msearch(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).msearch(arg0, arg1, arg2)
  }

  notify(path: string, target: string): RouteGrammarVerbChain
  notify(path: string, endpoint: Function): RouteGrammarVerbChain
  notify<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  notify(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).notify(arg0, arg1, arg2)
  }

  options(path: string, target: string): RouteGrammarVerbChain
  options(path: string, endpoint: Function): RouteGrammarVerbChain
  options<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  options(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).options(arg0, arg1, arg2)
  }

  patch(path: string, target: string): RouteGrammarVerbChain
  patch(path: string, endpoint: Function): RouteGrammarVerbChain
  patch<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  patch(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).patch(arg0, arg1, arg2)
  }

  post(path: string, target: string): RouteGrammarVerbChain
  post(path: string, endpoint: Function): RouteGrammarVerbChain
  post<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  post(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).post(arg0, arg1, arg2)
  }

  purge(path: string, target: string): RouteGrammarVerbChain
  purge(path: string, endpoint: Function): RouteGrammarVerbChain
  purge<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  purge(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).purge(arg0, arg1, arg2)
  }

  put(path: string, target: string): RouteGrammarVerbChain
  put(path: string, endpoint: Function): RouteGrammarVerbChain
  put<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  put(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).put(arg0, arg1, arg2)
  }

  report(path: string, target: string): RouteGrammarVerbChain
  report(path: string, endpoint: Function): RouteGrammarVerbChain
  report<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  report(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).report(arg0, arg1, arg2)
  }

  search(path: string, target: string): RouteGrammarVerbChain
  search(path: string, endpoint: Function): RouteGrammarVerbChain
  search<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  search(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).search(arg0, arg1, arg2)
  }

  subscribe(path: string, target: string): RouteGrammarVerbChain
  subscribe(path: string, endpoint: Function): RouteGrammarVerbChain
  subscribe<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  subscribe(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).subscribe(arg0, arg1, arg2)
  }

  trace(path: string, target: string): RouteGrammarVerbChain
  trace(path: string, endpoint: Function): RouteGrammarVerbChain
  trace<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  trace(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).trace(arg0, arg1, arg2)
  }

  unlock(path: string, target: string): RouteGrammarVerbChain
  unlock(path: string, endpoint: Function): RouteGrammarVerbChain
  unlock<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  unlock(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).unlock(arg0, arg1, arg2)
  }

  unsubscribe(path: string, target: string): RouteGrammarVerbChain
  unsubscribe(path: string, endpoint: Function): RouteGrammarVerbChain
  unsubscribe<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  unsubscribe(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).unsubscribe(arg0, arg1, arg2)
  }

  method(method: HttpMethod, path: string, target: string): RouteGrammarVerbChain
  method(method: HttpMethod, path: string, endpoint: Function): RouteGrammarVerbChain
  method<T extends Object>(method: HttpMethod, path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  method(arg0: any, arg1: any, arg2: any, arg3?: any): RouteGrammarVerbChain {
    return this.register<RouteBuilder>(new RouteBuilder()).method(arg0, arg1, arg2, arg3)
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
