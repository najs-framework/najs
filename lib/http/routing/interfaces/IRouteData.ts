import { HttpMethod } from '../../HttpMethod'
import { Controller } from '../../controller/Controller'

export type RouteMiddleware = string | ((request: any, response: any, next: () => void) => void)
export type RouteController = string | Controller
export type RouteEndpoint = string | Function

export interface IRouteData {
  metadata?: Object
  name?: string
  method: HttpMethod | string
  path: string
  prefix: string
  controller: RouteController
  endpoint: RouteEndpoint
  middleware: Array<RouteMiddleware>
}

// async function najs_middleware_manager(req: any, res: any, next: any) {
//   const middlewareList: any = []

//   for (const middleware of middlewareList) {
//     const response = await middleware.handle(req, function(error: any) {
//       if (error) {
//         throw error
//       }
//       return res
//     })
//     if (!response) {
//       continue
//     }
//   }
//   return next()
// }
