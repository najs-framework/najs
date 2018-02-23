import { IAutoload, make, register } from 'najs-binding'
import { Facade } from './../../facades/Facade'
import { GlobalFacadeClass, ResponseTypeClass } from '../../constants'
import { IView } from './types/IViewGrammars'
import { IResponse } from './IResponse'
import { IResponseFactory } from './IResponseFactory'

export class ResponseFactory extends Facade implements IResponseFactory, IAutoload {
  static className: string = GlobalFacadeClass.Response

  getClassName() {
    return GlobalFacadeClass.Response
  }

  view<R = IView>(view: string): R
  view<T extends Object = {}, R = IView>(view: string, variables: T): R
  view<T extends Object = {}, R = IView>(view: string, variables?: T): R {
    return make(ResponseTypeClass.View, [view, <any>variables])
  }

  json<R = IResponse>(value: any): R {
    return make(ResponseTypeClass.Json, [value])
  }

  jsonp<R = IResponse>(value: any): R {
    return make(ResponseTypeClass.Jsonp, [value])
  }

  redirect<R = IResponse>(url: string): R
  redirect<R = IResponse>(url: string, status: number): R
  redirect<R = IResponse>(url: string, status: number = 302): R {
    return make(ResponseTypeClass.Redirect, [url, status])
  }

  back<R = IResponse>(): R
  back<R = IResponse>(defaultUrl: string): R
  back<R = IResponse>(defaultUrl?: string): R {
    return make(ResponseTypeClass.Back, [defaultUrl])
  }
}
register(ResponseFactory)
