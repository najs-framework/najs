/// <reference path="../../contracts/types/http.ts" />

import { HttpMethod } from '../HttpMethod'
import { isString, isFunction } from 'lodash'

export class RouteData implements Partial<Najs.Http.IRouteData> {
  name?: string
  metadata?: Object
  method?: HttpMethod | 'all' | string
  path?: string
  prefix: string
  middleware: Array<Najs.Http.RouteMiddleware>
  controller?: Najs.Http.RouteController
  endpoint?: Najs.Http.RouteEndpoint
  isPrefixMerged: boolean = false

  constructor(method?: HttpMethod | 'all' | string, path?: string) {
    this.method = method
    this.path = path
    this.prefix = ''
    this.middleware = []
  }

  isValid(): boolean {
    // An invalid route is
    //   1. method not found or empty
    //   2. path not found or empty
    //   3. have no controller & endpoint
    if (!this.hasRequiredData()) {
      return false
    }

    // if endpoint is a function, it's is valid
    if (isFunction(this.endpoint)) {
      return true
    }

    return this.hasEndpointInController()
  }

  private hasEndpointInController(): boolean {
    if (!isString(this.endpoint) || typeof this.controller === 'undefined') {
      return false
    }

    if (isFunction(this.controller) && !isFunction(this.controller.prototype[this.endpoint])) {
      return false
    }

    if (typeof this.controller === 'object' && !isFunction(this.controller[this.endpoint])) {
      return false
    }
    return true
  }

  private hasRequiredData() {
    return (
      typeof this.method !== 'undefined' &&
      this.method !== '' &&
      typeof this.path !== 'undefined' &&
      this.path !== '' &&
      typeof this.endpoint !== 'undefined'
    )
  }

  mergeParentData(parent?: RouteData) {
    if (parent) {
      if (!this.isPrefixMerged) {
        this.prefix = parent.prefix + this.prefix
        this.isPrefixMerged = true
      }
      this.middleware = Array.from(new Set(parent.middleware.concat(this.middleware)))
    }
  }

  getData(parent?: RouteData): Najs.Http.IRouteData | undefined {
    if (!this.isValid()) {
      return undefined
    }

    this.mergeParentData(parent)
    return {
      metadata: this.metadata,
      name: this.name,
      method: <string>this.method,
      path: <string>this.path,
      prefix: this.prefix,
      middleware: this.middleware,
      controller: this.controller,
      endpoint: this.endpoint
    }
  }
}
