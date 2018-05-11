/// <reference path="../../contracts/HttpDriver.ts" />
/// <reference path="../../contracts/Response.ts" />

import { register } from 'najs-binding'
import { Najs } from '../../constants'

export class JsonResponse implements Najs.Contracts.Response {
  static className: string = Najs.Http.Response.JsonResponse
  protected value: any

  constructor(value: any) {
    this.value = value
  }

  getClassName() {
    return Najs.Http.Response.JsonResponse
  }

  respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>) {
    return driver.respondJson(response, this.value)
  }
}
register(JsonResponse, Najs.Http.Response.JsonResponse)
