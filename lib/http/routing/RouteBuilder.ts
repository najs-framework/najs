/// <reference path="../../contracts/types/routing.ts" />

import { HttpMethod } from '../HttpMethod'
import { IRouteBuilder } from './interfaces/IRouteBuilder'
import { IRouteData } from './interfaces/IRouteData'
import { flatten, isString, isFunction, isObject } from 'lodash'
import { Controller } from '../controller/Controller'
import { RouteData } from './RouteData'

export type HttpMethodTarget = string | Controller | Function | Object

const HTTP_VERBS = {
  all: 'all',
  checkout: HttpMethod.CHECKOUT,
  copy: HttpMethod.COPY,
  delete: HttpMethod.DELETE,
  get: HttpMethod.GET,
  head: HttpMethod.HEAD,
  lock: HttpMethod.LOCK,
  merge: HttpMethod.MERGE,
  mkactivity: HttpMethod.MKACTIVITY,
  mkcol: HttpMethod.MKCOL,
  move: HttpMethod.MOVE,
  msearch: HttpMethod.M_SEARCH,
  notify: HttpMethod.NOTIFY,
  options: HttpMethod.OPTIONS,
  patch: HttpMethod.PATCH,
  post: HttpMethod.POST,
  purge: HttpMethod.PURGE,
  put: HttpMethod.PUT,
  report: HttpMethod.REPORT,
  search: HttpMethod.SEARCH,
  subscribe: HttpMethod.SUBSCRIBE,
  trace: HttpMethod.TRACE,
  unlock: HttpMethod.UNLOCK,
  unsubscribe: HttpMethod.UNSUBSCRIBE
}

export interface RouteBuilder extends Najs.Http.Routing.Verbs {}
export class RouteBuilder
  implements IRouteBuilder, Najs.Http.Routing.Control, Najs.Http.Routing.Group, Najs.Http.Routing.Named {
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

  use(...list: Array<any>): any {
    return this.middleware(...list)
  }

  middleware(...list: Array<any>): any {
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

  prefix(prefix: string): any {
    this.data.prefix = prefix
    return this
  }

  group(callback: () => void): Najs.Http.Routing.GroupChain {
    if (!this.data.metadata) {
      this.data.metadata = {}
    }
    this.data.metadata['grouped'] = true
    callback.call(undefined)
    delete this.data.metadata['grouped']
    return this
  }

  name(name: string): any {
    this.data.name = name
    return this
  }

  method(method: HttpMethod, path: string, arg0: HttpMethodTarget, arg1?: any): Najs.Http.Routing.VerbChain {
    this.data.method = method
    this.data.path = path

    if (typeof arg1 === 'undefined') {
      return this.method_overload_3_params(method, path, arg0)
    }
    return this.method_overload_4_params(method, path, arg0, arg1)
  }

  private method_overload_3_params(
    method: HttpMethod,
    path: string,
    arg0: HttpMethodTarget
  ): Najs.Http.Routing.VerbChain {
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

    throw new TypeError('Invalid Route')
  }

  private method_overload_4_params(
    method: HttpMethod,
    path: string,
    arg0: HttpMethodTarget,
    arg1?: any
  ): Najs.Http.Routing.VerbChain {
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

  static get HttpVerbsSupported(): string[] {
    return Object.keys(HTTP_VERBS)
  }
}

// implements IRouteGrammarVerbs implicitly
for (const name in HTTP_VERBS) {
  RouteBuilder.prototype[name] = function(arg0: any, arg1: any, arg2: any) {
    return this.method(HTTP_VERBS[name], arg0, arg1, arg2)
  }
}
