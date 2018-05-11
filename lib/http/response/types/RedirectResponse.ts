/// <reference path="../../../contracts/HttpDriver.ts" />

import { IAutoload, register } from 'najs-binding'
import { ResponseTypeClass } from '../../../constants'
import { IResponse } from '../IResponse'

export class RedirectResponse implements IResponse, IAutoload {
  static className: string = ResponseTypeClass.Redirect
  protected url: string
  protected status: number

  constructor(url: string, status: number = 302) {
    this.url = url
    this.status = status
  }

  getClassName() {
    return ResponseTypeClass.Redirect
  }

  respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>) {
    return driver.respondRedirect(response, this.url, this.status)
  }
}
register(RedirectResponse)
