/// <reference path="../../contracts/Response.ts" />

import { IAutoload, make, register } from 'najs-binding'
import { Facade } from 'najs-facade'
import { GlobalFacadeClass, Najs } from '../../constants'
import { IView } from './IViewGrammars'
import { IResponseFactory } from './IResponseFactory'

export class ResponseFactory extends Facade implements IResponseFactory, IAutoload {
  static className: string = GlobalFacadeClass.Response

  getClassName() {
    return GlobalFacadeClass.Response
  }

  view<R = IView>(view: string): R
  view<T extends Object = {}, R = IView>(view: string, variables: T): R
  view<T extends Object = {}, R = IView>(view: string, variables?: T): R {
    return make(Najs.Http.Response.ViewResponse, [view, <any>variables])
  }

  json<R = Najs.Contracts.Response>(value: any): R {
    return make(Najs.Http.Response.JsonResponse, [value])
  }

  jsonp<R = Najs.Contracts.Response>(value: any): R {
    return make(Najs.Http.Response.JsonpResponse, [value])
  }

  redirect<R = Najs.Contracts.Response>(url: string): R
  redirect<R = Najs.Contracts.Response>(url: string, status: number): R
  redirect<R = Najs.Contracts.Response>(url: string, status: number = 302): R {
    return make(Najs.Http.Response.RedirectResponse, [url, status])
  }

  back<R = Najs.Contracts.Response>(): R
  back<R = Najs.Contracts.Response>(defaultUrl: string): R
  back<R = Najs.Contracts.Response>(defaultUrl?: string): R {
    return make(Najs.Http.Response.BackResponse, [defaultUrl])
  }
}
register(ResponseFactory)
