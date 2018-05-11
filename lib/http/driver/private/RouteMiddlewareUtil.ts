/// <reference path="../../../contracts/HttpDriver.ts" />
/// <reference path="../../../contracts/types/http.ts" />

import { HttpKernel } from '../../HttpKernel'
import { flatten, isFunction, isString, isObject } from 'lodash'

export class RouteMiddlewareUtil {
  static getMiddlewareListOfRoute(route: Najs.Http.IRouteData, httpKernel: HttpKernel): Najs.Http.IMiddleware[] {
    const middlewareListBag: Najs.Http.IMiddleware[][] = route.middleware
      .filter(function(middleware) {
        return !isFunction(middleware)
      })
      .map(middleware => {
        return this.getMiddlewareList(httpKernel, middleware)
      })
    return Array.from(new Set(flatten(middlewareListBag)))
  }

  protected static getMiddlewareList(httpKernel: HttpKernel, middleware: any): Najs.Http.IMiddleware[] {
    if (isString(middleware)) {
      return httpKernel.getMiddleware(middleware)
    }
    if (isObject(middleware)) {
      return [middleware]
    }
    return []
  }

  static createNativeMiddlewareHandlers(
    middlewareList: Najs.Http.IMiddleware[],
    driver: Najs.Contracts.HttpDriver<any, any>
  ): Najs.Http.NativeMiddleware[] {
    const result: Najs.Http.NativeMiddleware[][] = middlewareList
      .filter(function(middleware) {
        return isFunction(middleware.native)
      })
      .reduce<Najs.Http.NativeMiddleware[][]>(function(memo, middleware) {
        const native = Reflect.apply(<Function>middleware.native, middleware, [driver])
        if (!native) {
          return memo
        }

        const items = Array.isArray(native) ? native : [native]
        memo.push(items.filter(item => isFunction(item)))
        return memo
      }, [])
    return Array.from(new Set(flatten(result)))
  }

  static async applyBeforeMiddleware(
    middlewareList: Najs.Http.IMiddleware[],
    request: any,
    response: any,
    controller: any
  ) {
    if (middlewareList.length === 0) {
      return
    }

    for (const middleware of middlewareList) {
      if (isFunction(middleware.before)) {
        await Reflect.apply(middleware.before, middleware, [request, response, controller])
      }
    }
  }

  static async applyAfterMiddleware(
    middlewareList: Najs.Http.IMiddleware[],
    request: any,
    response: any,
    value: any,
    controller: any
  ) {
    if (middlewareList.length === 0) {
      return value
    }

    let result: any = value
    for (const middleware of middlewareList) {
      if (isFunction(middleware.after)) {
        result = await Reflect.apply(middleware.after, middleware, [request, response, result, controller])
      }
    }
    return result
  }
}
