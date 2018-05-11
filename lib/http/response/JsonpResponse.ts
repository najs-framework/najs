/// <reference path="../../contracts/HttpDriver.ts" />
/// <reference path="../../contracts/Response.ts" />

import { register } from 'najs-binding'
import { Najs } from '../../constants'

export class JsonpResponse implements Najs.Contracts.Response {
  static className: string = Najs.Http.Response.JsonpResponse
  protected value: any

  constructor(value: any) {
    this.value = value
  }

  getClassName() {
    return Najs.Http.Response.JsonpResponse
  }

  respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>) {
    return driver.respondJsonp(response, this.value)
  }
}
register(JsonpResponse, Najs.Http.Response.JsonpResponse)
