/// <reference path="../../contracts/HttpDriver.ts" />
/// <reference path="../../contracts/Response.ts" />

import { register } from 'najs-binding'
import { Najs } from '../../constants'

export class RedirectResponse implements Najs.Contracts.Response {
  static className: string = Najs.Http.Response.RedirectResponse
  protected url: string
  protected status: number

  constructor(url: string, status: number = 302) {
    this.url = url
    this.status = status
  }

  getClassName() {
    return Najs.Http.Response.RedirectResponse
  }

  respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>) {
    return driver.respondRedirect(response, this.url, this.status)
  }
}
register(RedirectResponse, Najs.Http.Response.RedirectResponse)
