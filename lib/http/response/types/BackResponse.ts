/// <reference path="../../../contracts/HttpDriver.ts" />

import { IAutoload, register } from 'najs-binding'
import { ResponseTypeClass } from '../../../constants'
import { IResponse } from '../IResponse'

export class BackResponse implements IResponse, IAutoload {
  static className: string = ResponseTypeClass.Back
  protected defaultUrl: string

  constructor(defaultUrl?: string)
  constructor(defaultUrl: string = '/') {
    this.defaultUrl = defaultUrl
  }

  getClassName() {
    return ResponseTypeClass.Back
  }

  respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>) {
    let url: string = request.header('Referer')
    if (!url) {
      url = this.defaultUrl
    }
    return driver.respondRedirect(response, url, 302)
  }
}
register(BackResponse)
