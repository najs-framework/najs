import { HttpMethod } from '../../HttpMethod'
import { Controller } from '../../controller/Controller'
import { IMiddleware } from '../../middleware/IMiddleware'

export type RouteMiddleware = string | IMiddleware | Function
export type RouteController = string | Controller
export type RouteEndpoint = string | Function

export interface IRouteData {
  metadata?: Object
  name?: string
  method: HttpMethod | string
  path: string
  prefix: string
  controller?: RouteController
  endpoint?: RouteEndpoint
  middleware: Array<RouteMiddleware>
}
