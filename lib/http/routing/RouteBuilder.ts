import { HttpMethod } from './../HttpMethod'
import { IRouteBuilder } from './interfaces/IRouteBuilder'
import { IRouteData } from './interfaces/IRouteData'
import {
  RouteGrammarGroupChain,
  RouteGrammarVerbChain,
  RouteGrammarNameChain,
  RouteGrammarControlChain,
  IRouteGrammarControl,
  IRouteGrammarGroup,
  IRouteGrammarNamed,
  IRouteGrammarVerbs
} from './interfaces/IRouteGrammars'
import { IMiddleware } from '../middleware/IMiddleware'
import { isString, isFunction, isObject } from 'lodash'
/**
 * Route syntax implementation
 */
export class RouteBuilder
  implements IRouteBuilder, IRouteGrammarControl, IRouteGrammarGroup, IRouteGrammarNamed, IRouteGrammarVerbs {
  protected data: IRouteData
  protected children: Array<IRouteBuilder>

  constructor()
  constructor(method: string, path: string)
  constructor(method?: string, path?: string) {
    this.data = {
      method: method || HttpMethod.GET,
      path: path || '',
      prefix: '',
      controller: '',
      endpoint: '',
      middleware: []
    }
    this.children = []
  }

  getRouteData(): IRouteData {
    // const result: IRouteData[] = []
    return this.data
  }

  registerChildRoute(route: IRouteBuilder): void {
    if (this.children.length === 0) {
      this.children.push(route)
      return
    }

    const lastChild = this.children[this.children.length - 1]
    if (lastChild.shouldRegisterChildRoute()) {
      lastChild.registerChildRoute(route)
      return
    }

    this.children.push(route)
  }

  shouldRegisterChildRoute(): boolean {
    if (!this.data.metadata) {
      return false
    }
    return this.data.metadata['grouped'] === true
  }

  hasChildRoute(): boolean {
    return this.children.length !== 0
  }

  // -------------------------------------------------------------------------------------------------------------------

  use(middleware: IMiddleware): this
  use(middleware: Function): this
  use(middleware: string[]): this
  use(middleware: IMiddleware[]): this
  use(middleware: Function[]): this
  use(...middleware: Array<string | string[] | IMiddleware | IMiddleware[] | Function | Function[]>): this
  use(...list: Array<any>): this {
    return this.middleware(...list)
  }

  middleware(middleware: IMiddleware): this
  middleware(middleware: Function): this
  middleware(middleware: string[]): this
  middleware(middleware: IMiddleware[]): this
  middleware(middleware: Function[]): this
  middleware(...middleware: Array<string | string[] | IMiddleware | IMiddleware[] | Function | Function[]>): this
  middleware(...list: Array<any>): this {
    for (const middleware of list) {
      if (Array.isArray(middleware)) {
        this.data.middleware = this.data.middleware.concat(<any[]>middleware.filter(
          item => isString(item) || isObject(item) || isFunction(item)
        ))
        continue
      }

      if (isString(middleware) || isObject(middleware) || isFunction(middleware)) {
        this.data.middleware.push(<string>middleware)
        continue
      }
    }
    return this
  }

  prefix(prefix: string): RouteGrammarControlChain {
    this.data.prefix = prefix
    return this
  }

  group(callback: () => void): RouteGrammarGroupChain {
    if (!this.data.metadata) {
      this.data.metadata = {}
    }
    this.data.metadata['grouped'] = true
    callback.call(undefined)
    delete this.data.metadata['grouped']
    return this
  }

  name(name: string): RouteGrammarNameChain {
    this.data.name = name
    return this
  }

  checkout(path: string, target: string): RouteGrammarVerbChain
  checkout(path: string, endpoint: Function): RouteGrammarVerbChain
  checkout<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  checkout(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.CHECKOUT, arg0, arg1, arg2)
  }

  copy(path: string, target: string): RouteGrammarVerbChain
  copy(path: string, endpoint: Function): RouteGrammarVerbChain
  copy<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  copy(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.COPY, arg0, arg1, arg2)
  }

  delete(path: string, target: string): RouteGrammarVerbChain
  delete(path: string, endpoint: Function): RouteGrammarVerbChain
  delete<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  delete(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.DELETE, arg0, arg1, arg2)
  }

  get(path: string, target: string): RouteGrammarVerbChain
  get(path: string, endpoint: Function): RouteGrammarVerbChain
  get<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  get(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.GET, arg0, arg1, arg2)
  }

  head(path: string, target: string): RouteGrammarVerbChain
  head(path: string, endpoint: Function): RouteGrammarVerbChain
  head<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  head(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.HEAD, arg0, arg1, arg2)
  }

  lock(path: string, target: string): RouteGrammarVerbChain
  lock(path: string, endpoint: Function): RouteGrammarVerbChain
  lock<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  lock(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.LOCK, arg0, arg1, arg2)
  }

  merge(path: string, target: string): RouteGrammarVerbChain
  merge(path: string, endpoint: Function): RouteGrammarVerbChain
  merge<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  merge(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.MERGE, arg0, arg1, arg2)
  }

  mkactivity(path: string, target: string): RouteGrammarVerbChain
  mkactivity(path: string, endpoint: Function): RouteGrammarVerbChain
  mkactivity<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  mkactivity(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.MKACTIVITY, arg0, arg1, arg2)
  }

  mkcol(path: string, target: string): RouteGrammarVerbChain
  mkcol(path: string, endpoint: Function): RouteGrammarVerbChain
  mkcol<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  mkcol(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.MKCOL, arg0, arg1, arg2)
  }

  move(path: string, target: string): RouteGrammarVerbChain
  move(path: string, endpoint: Function): RouteGrammarVerbChain
  move<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  move(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.MOVE, arg0, arg1, arg2)
  }

  msearch(path: string, target: string): RouteGrammarVerbChain
  msearch(path: string, endpoint: Function): RouteGrammarVerbChain
  msearch<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  msearch(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.M_SEARCH, arg0, arg1, arg2)
  }

  notify(path: string, target: string): RouteGrammarVerbChain
  notify(path: string, endpoint: Function): RouteGrammarVerbChain
  notify<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  notify(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.NOTIFY, arg0, arg1, arg2)
  }

  options(path: string, target: string): RouteGrammarVerbChain
  options(path: string, endpoint: Function): RouteGrammarVerbChain
  options<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  options(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.OPTIONS, arg0, arg1, arg2)
  }

  patch(path: string, target: string): RouteGrammarVerbChain
  patch(path: string, endpoint: Function): RouteGrammarVerbChain
  patch<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  patch(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.PATCH, arg0, arg1, arg2)
  }

  post(path: string, target: string): RouteGrammarVerbChain
  post(path: string, endpoint: Function): RouteGrammarVerbChain
  post<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  post(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.POST, arg0, arg1, arg2)
  }

  purge(path: string, target: string): RouteGrammarVerbChain
  purge(path: string, endpoint: Function): RouteGrammarVerbChain
  purge<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  purge(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.PURGE, arg0, arg1, arg2)
  }

  put(path: string, target: string): RouteGrammarVerbChain
  put(path: string, endpoint: Function): RouteGrammarVerbChain
  put<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  put(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.PUT, arg0, arg1, arg2)
  }

  report(path: string, target: string): RouteGrammarVerbChain
  report(path: string, endpoint: Function): RouteGrammarVerbChain
  report<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  report(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.REPORT, arg0, arg1, arg2)
  }

  search(path: string, target: string): RouteGrammarVerbChain
  search(path: string, endpoint: Function): RouteGrammarVerbChain
  search<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  search(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.SEARCH, arg0, arg1, arg2)
  }

  subscribe(path: string, target: string): RouteGrammarVerbChain
  subscribe(path: string, endpoint: Function): RouteGrammarVerbChain
  subscribe<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  subscribe(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.SUBSCRIBE, arg0, arg1, arg2)
  }

  trace(path: string, target: string): RouteGrammarVerbChain
  trace(path: string, endpoint: Function): RouteGrammarVerbChain
  trace<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  trace(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.TRACE, arg0, arg1, arg2)
  }

  unlock(path: string, target: string): RouteGrammarVerbChain
  unlock(path: string, endpoint: Function): RouteGrammarVerbChain
  unlock<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  unlock(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.UNLOCK, arg0, arg1, arg2)
  }

  unsubscribe(path: string, target: string): RouteGrammarVerbChain
  unsubscribe(path: string, endpoint: Function): RouteGrammarVerbChain
  unsubscribe<T extends Object>(path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  unsubscribe(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.UNSUBSCRIBE, arg0, arg1, arg2)
  }

  method(method: HttpMethod, path: string, target: string): RouteGrammarVerbChain
  method(method: HttpMethod, path: string, endpoint: Function): RouteGrammarVerbChain
  method<T extends Object>(method: HttpMethod, path: string, controller: T, endpoint: keyof T): RouteGrammarVerbChain
  method(method: HttpMethod, path: string, arg0: string | Function | Object, arg1?: any): RouteGrammarVerbChain {
    return this
  }
}
