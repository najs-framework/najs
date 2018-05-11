/// <reference path="../../../contracts/HttpDriver.ts" />

import { IAutoload, register } from 'najs-binding'
import { ResponseTypeClass } from '../../../constants'
import { IResponse } from '../IResponse'

export class JsonResponse implements IResponse, IAutoload {
  static className: string = ResponseTypeClass.Json
  protected value: any

  constructor(value: any) {
    this.value = value
  }

  getClassName() {
    return ResponseTypeClass.Json
  }

  respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>) {
    return driver.respondJson(response, this.value)
  }
}
register(JsonResponse)
