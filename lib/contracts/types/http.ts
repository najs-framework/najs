/// <reference types="najs-binding" />
/// <reference path="../HttpDriver.ts" />

namespace Najs.Http {
  export interface CookieOptions {
    maxAge?: number
    signed?: boolean
    expires?: Date | boolean
    httpOnly?: boolean
    path?: string
    domain?: string
    secure?: boolean | 'auto'
    encode?: (val: string) => void
    sameSite?: boolean | string
  }

  export type StartOptions = {
    createServer?: boolean
    port?: number
    host?: any
  }

  export type HttpMethod =
    | 'CHECKOUT'
    | 'COPY'
    | 'DELETE'
    | 'GET'
    | 'HEAD'
    | 'LOCK'
    | 'MERGE'
    | 'MKACTIVITY'
    | 'MKCOL'
    | 'MOVE'
    | 'M-SEARCH'
    | 'NOTIFY'
    | 'OPTIONS'
    | 'PATCH'
    | 'POST'
    | 'PURGE'
    | 'PUT'
    | 'REPORT'
    | 'SEARCH'
    | 'SUBSCRIBE'
    | 'TRACE'
    | 'UNLOCK'
    | 'UNSUBSCRIBE'

  export type NativeMiddleware = (request: any, response: any, next: Function) => void

  export interface IMiddleware {
    native?(driver: Contracts.HttpDriver<any, any>): NativeMiddleware | NativeMiddleware[] | undefined

    before?(request: any, response: any, controller: any): Promise<any>

    after?(request: any, response: any, result: any, controller: any): Promise<any>
  }

  export type RouteMiddleware = string | IMiddleware | NativeMiddleware
  export type RouteController = string | IController<any, any> | Object
  export type RouteEndpoint = string | Function

  export interface IRouteData {
    metadata?: Object
    name?: string
    method: HttpMethod | 'all' | string
    path: string
    prefix: string
    middleware: Array<RouteMiddleware>
    controller?: string | IController<any, any> | Object
    endpoint?: string | Function
  }

  export interface IRouteBuilder {
    getRouteData(parent?: Partial<IRouteData>): IRouteData[]
    hasChildRoute(): boolean
    registerChildRoute(route: IRouteBuilder): void
    shouldRegisterChildRoute(): boolean
  }

  export interface IController<Request, Response> extends Najs.Contracts.Autoload {
    request: Request

    response: Response

    input: any

    auth?: any

    session?: any

    cookie?: Najs.Contracts.Cookie
  }
}
