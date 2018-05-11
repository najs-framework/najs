/// <reference path="../../../contracts/HttpDriver.ts" />

import { IAutoload, register } from 'najs-binding'
import { ResponseTypeClass } from '../../../constants'
import { IResponse } from '../IResponse'

export class JsonpResponse implements IResponse, IAutoload {
  static className: string = ResponseTypeClass.Jsonp
  protected value: any

  constructor(value: any) {
    this.value = value
  }

  getClassName() {
    return ResponseTypeClass.Jsonp
  }

  respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>) {
    return driver.respondJsonp(response, this.value)
  }
}
register(JsonpResponse)
