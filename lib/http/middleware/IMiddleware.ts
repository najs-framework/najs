import { IHttpDriver } from '../driver/IHttpDriver'

export interface IMiddleware {
  native?(driver: IHttpDriver): void
  before?(request: any, response: any): Promise<any>
  after?(request: any, response: any, result: any): Promise<any>
}
// async function middleware_before_cors(request: any) {
//   request.cors = 'ok'
//   console.log('middleware before cors', request)
// }

// async function middleware_before_csrf(request: any) {
//   request.cors = 'csrf'
//   console.log('middleware before csrf', request)
// }

// async function middleware_after_cached(request: any, response: any) {
//   response.cached = true
//   console.log('middleware after cached', response)
// }

// async function middleware_after_transform(request: any, response: any) {
//   // response.transformed = true
//   console.log(request)
//   console.log('middleware after transform', response)
//   return { completely: 'difference' }
// }

// async function action() {
//   console.log('action called')
//   return { ok: true, from: 'action' }
// }

// async function middleware_manager() {
//   const request = { url: '/url' }
//   const middlewareBefore = [middleware_before_csrf, middleware_before_cors]
//   const middlewareAfter = [middleware_after_transform, middleware_after_cached]
//   for (const middleware of middlewareBefore) {
//     await middleware(request)
//   }
//   let result: any = await action()
//   for (const middleware of middlewareAfter) {
//     const middlewareResult = await middleware(request, result)
//     if (typeof middlewareResult === 'undefined' || middlewareResult === result) {
//       continue
//     }
//     result = middlewareResult
//   }
//   console.log(result)
//   // const next = async function(error?: any) {
//   //   console.log('trigger next')
//   //   if (error) {
//   //     throw error
//   //   }
//   //   if (!result) {
//   //     console.log('never call action')
//   //     result = await action()
//   //   } else {
//   //     console.log('already call action')
//   //   }
//   //   return result
//   // }
//   // for (const middleware of middlewareBefore) {
//   // middleware(request, result, next)
//   // console.log(result)
//   // }
//   // if (!result) {
//   //   result = await next()
//   // }
//   // console.log('end of the middleware', result)
// }
// middleware_manager()
