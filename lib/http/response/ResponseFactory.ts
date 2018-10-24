/// <reference path="../../contracts/Response.ts" />
/// <reference path="../../contracts/ViewResponse.ts" />
/// <reference path="../../contracts/ResponseFactory.ts" />

import './BackResponse'
import './JsonpResponse'
import './JsonResponse'
import './RedirectResponse'
import './ViewResponse'
import { make, register } from 'najs-binding'
import { Facade } from 'najs-facade'
import { Najs } from '../../constants'

export class ResponseFactory extends Facade implements Najs.Contracts.ResponseFactory {
  static className: string = Najs.Http.ResponseFactory

  getClassName() {
    return Najs.Http.ResponseFactory
  }

  view<T extends Object = {}>(view: string, variables?: T): Najs.Contracts.ViewResponse {
    return make(Najs.Http.Response.ViewResponse, [view, <any>variables])
  }

  json(value: any): Najs.Contracts.Response {
    return make(Najs.Http.Response.JsonResponse, [value])
  }

  jsonp(value: any): Najs.Contracts.Response {
    return make(Najs.Http.Response.JsonpResponse, [value])
  }

  redirect(url: string, status: number = 302): Najs.Contracts.Response {
    return make(Najs.Http.Response.RedirectResponse, [url, status])
  }

  back(defaultUrl?: string): Najs.Contracts.Response {
    return make(Najs.Http.Response.BackResponse, [defaultUrl])
  }
}
register(ResponseFactory, Najs.Http.ResponseFactory)
