/// <reference path="../../../contracts/types/http.ts" />

import { HttpMethod } from '../../HttpMethod'
import { Controller } from '../../controller/Controller'

export type RouteMiddleware = string | Najs.Http.IMiddleware | Function
export type RouteController = string | Controller | Object
export type RouteEndpoint = string | Function

export interface IRouteData {
  metadata?: Object
  name?: string
  method: HttpMethod | 'all' | string
  path: string
  prefix: string
  middleware: Array<RouteMiddleware>
  controller?: RouteController
  endpoint?: RouteEndpoint
}
