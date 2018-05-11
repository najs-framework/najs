/// <reference path="../../contracts/HttpDriver.ts" />
/// <reference path="../../contracts/Response.ts" />
/// <reference path="../../contracts/types/http.ts" />

import { register } from 'najs-binding'
import { Najs } from '../../constants'

export class BackResponse implements Najs.Contracts.Response {
  static className: string = Najs.Http.Response.BackResponse
  protected defaultUrl: string

  constructor(defaultUrl?: string)
  constructor(defaultUrl: string = '/') {
    this.defaultUrl = defaultUrl
  }

  getClassName() {
    return Najs.Http.Response.BackResponse
  }

  respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>) {
    let url: string = request.header('Referer')
    if (!url) {
      url = this.defaultUrl
    }
    return driver.respondRedirect(response, url, 302)
  }
}
register(BackResponse, Najs.Http.Response.BackResponse)
