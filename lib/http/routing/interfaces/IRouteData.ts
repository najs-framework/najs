import { HttpMethod } from '../../HttpMethod'
import { Controller } from '../../controller/Controller'
import { IMiddleware } from '../../middleware/IMiddleware'

export type RouteMiddleware = string | IMiddleware | Function
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
