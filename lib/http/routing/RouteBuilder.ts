import { HttpMethod } from '../HttpMethod'
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
import { flatten, isString, isFunction, isObject } from 'lodash'
import { Controller } from '../controller/Controller'
import { RouteData } from './RouteData'

export type HttpMethodTarget = string | Controller | Function | Object

/**
 * Route syntax implementation
 */
export class RouteBuilder
  implements IRouteBuilder, IRouteGrammarControl, IRouteGrammarGroup, IRouteGrammarNamed, IRouteGrammarVerbs {
  protected data: RouteData
  protected children: Array<IRouteBuilder>

  constructor()
  constructor(method: HttpMethod | 'all' | string, path: string)
  constructor(method?: HttpMethod | 'all' | string, path?: string) {
    this.data = new RouteData(method, path)
    this.children = []
  }

  getRouteData(parent?: RouteData): IRouteData[] {
    if (this.children.length === 0) {
      const data: IRouteData | undefined = this.data.getData(parent)
      return data ? [data] : []
    }
    const result: IRouteData[][] = this.children.map(item => {
      this.data.mergeParentData(parent)
      return item.getRouteData(this.data)
    })
    return flatten(result)
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

  method(method: HttpMethod | 'all', path: string, target: string): RouteGrammarVerbChain
  method(method: HttpMethod | 'all', path: string, endpoint: Function): RouteGrammarVerbChain
  method(method: HttpMethod | 'all', path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  method(method: HttpMethod | 'all', path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  method(method: HttpMethod, path: string, arg0: HttpMethodTarget, arg1?: any): RouteGrammarVerbChain {
    this.data.method = method
    this.data.path = path

    if (typeof arg1 === 'undefined') {
      if (isString(arg0)) {
        const parts: string[] = (arg0 as string).split('@')
        if (parts.length !== 2) {
          throw new Error('Target "' + arg0 + '" is invalid. Correct format: ControllerName@endpointName')
        }
        this.data.controller = parts[0]
        this.data.endpoint = parts[1]
        return this
      }

      if (isFunction(arg0)) {
        this.data.endpoint = arg0
        return this
      }
    }

    if (isFunction(arg0)) {
      if (!isFunction(Reflect.get(arg0.prototype, arg1))) {
        throw new ReferenceError('Endpoint ' + arg1 + ' not found')
      }
      this.data.controller = arg0
      this.data.endpoint = arg1
      return this
    }

    if (isObject(arg0)) {
      if (!isFunction(Reflect.get(arg0 as Object, arg1))) {
        throw new ReferenceError('Endpoint ' + arg1 + ' not found')
      }
      this.data.controller = <Object>arg0
      this.data.endpoint = arg1
      return this
    }

    throw new TypeError('Invalid Route')
  }

  all(path: string, target: string): RouteGrammarVerbChain
  all(path: string, endpoint: Function): RouteGrammarVerbChain
  all(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  all(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  all(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method('all', arg0, arg1, arg2)
  }

  checkout(path: string, target: string): RouteGrammarVerbChain
  checkout(path: string, endpoint: Function): RouteGrammarVerbChain
  checkout(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  checkout(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  checkout(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.CHECKOUT, arg0, arg1, arg2)
  }

  copy(path: string, target: string): RouteGrammarVerbChain
  copy(path: string, endpoint: Function): RouteGrammarVerbChain
  copy(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  copy(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  copy(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.COPY, arg0, arg1, arg2)
  }

  delete(path: string, target: string): RouteGrammarVerbChain
  delete(path: string, endpoint: Function): RouteGrammarVerbChain
  delete(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  delete(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  delete(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.DELETE, arg0, arg1, arg2)
  }

  get(path: string, target: string): RouteGrammarVerbChain
  get(path: string, endpoint: Function): RouteGrammarVerbChain
  get(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  get(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  get(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.GET, arg0, arg1, arg2)
  }

  head(path: string, target: string): RouteGrammarVerbChain
  head(path: string, endpoint: Function): RouteGrammarVerbChain
  head(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  head(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  head(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.HEAD, arg0, arg1, arg2)
  }

  lock(path: string, target: string): RouteGrammarVerbChain
  lock(path: string, endpoint: Function): RouteGrammarVerbChain
  lock(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  lock(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  lock(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.LOCK, arg0, arg1, arg2)
  }

  merge(path: string, target: string): RouteGrammarVerbChain
  merge(path: string, endpoint: Function): RouteGrammarVerbChain
  merge(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  merge(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  merge(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.MERGE, arg0, arg1, arg2)
  }

  mkactivity(path: string, target: string): RouteGrammarVerbChain
  mkactivity(path: string, endpoint: Function): RouteGrammarVerbChain
  mkactivity(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  mkactivity(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  mkactivity(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.MKACTIVITY, arg0, arg1, arg2)
  }

  mkcol(path: string, target: string): RouteGrammarVerbChain
  mkcol(path: string, endpoint: Function): RouteGrammarVerbChain
  mkcol(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  mkcol(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  mkcol(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.MKCOL, arg0, arg1, arg2)
  }

  move(path: string, target: string): RouteGrammarVerbChain
  move(path: string, endpoint: Function): RouteGrammarVerbChain
  move(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  move(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  move(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.MOVE, arg0, arg1, arg2)
  }

  msearch(path: string, target: string): RouteGrammarVerbChain
  msearch(path: string, endpoint: Function): RouteGrammarVerbChain
  msearch(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  msearch(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  msearch(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.M_SEARCH, arg0, arg1, arg2)
  }

  notify(path: string, target: string): RouteGrammarVerbChain
  notify(path: string, endpoint: Function): RouteGrammarVerbChain
  notify(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  notify(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  notify(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.NOTIFY, arg0, arg1, arg2)
  }

  options(path: string, target: string): RouteGrammarVerbChain
  options(path: string, endpoint: Function): RouteGrammarVerbChain
  options(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  options(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  options(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.OPTIONS, arg0, arg1, arg2)
  }

  patch(path: string, target: string): RouteGrammarVerbChain
  patch(path: string, endpoint: Function): RouteGrammarVerbChain
  patch(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  patch(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  patch(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.PATCH, arg0, arg1, arg2)
  }

  post(path: string, target: string): RouteGrammarVerbChain
  post(path: string, endpoint: Function): RouteGrammarVerbChain
  post(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  post(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  post(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.POST, arg0, arg1, arg2)
  }

  purge(path: string, target: string): RouteGrammarVerbChain
  purge(path: string, endpoint: Function): RouteGrammarVerbChain
  purge(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  purge(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  purge(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.PURGE, arg0, arg1, arg2)
  }

  put(path: string, target: string): RouteGrammarVerbChain
  put(path: string, endpoint: Function): RouteGrammarVerbChain
  put(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  put(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  put(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.PUT, arg0, arg1, arg2)
  }

  report(path: string, target: string): RouteGrammarVerbChain
  report(path: string, endpoint: Function): RouteGrammarVerbChain
  report(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  report(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  report(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.REPORT, arg0, arg1, arg2)
  }

  search(path: string, target: string): RouteGrammarVerbChain
  search(path: string, endpoint: Function): RouteGrammarVerbChain
  search(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  search(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  search(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.SEARCH, arg0, arg1, arg2)
  }

  subscribe(path: string, target: string): RouteGrammarVerbChain
  subscribe(path: string, endpoint: Function): RouteGrammarVerbChain
  subscribe(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  subscribe(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  subscribe(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.SUBSCRIBE, arg0, arg1, arg2)
  }

  trace(path: string, target: string): RouteGrammarVerbChain
  trace(path: string, endpoint: Function): RouteGrammarVerbChain
  trace(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  trace(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  trace(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.TRACE, arg0, arg1, arg2)
  }

  unlock(path: string, target: string): RouteGrammarVerbChain
  unlock(path: string, endpoint: Function): RouteGrammarVerbChain
  unlock(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  unlock(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  unlock(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.UNLOCK, arg0, arg1, arg2)
  }

  unsubscribe(path: string, target: string): RouteGrammarVerbChain
  unsubscribe(path: string, endpoint: Function): RouteGrammarVerbChain
  unsubscribe(path: string, controller: Controller, endpoint: string): RouteGrammarVerbChain
  unsubscribe(path: string, controller: Object, endpoint: string): RouteGrammarVerbChain
  unsubscribe(arg0: any, arg1: any, arg2?: any): RouteGrammarVerbChain {
    return this.method(HttpMethod.UNSUBSCRIBE, arg0, arg1, arg2)
  }
}
