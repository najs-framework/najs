import { IResponse } from '../IResponse'
import { IHttpDriver } from '../../IHttpDriver'

export class RedirectResponse implements IResponse {
  private url: string
  private status: number

  constructor(url: string, status: number = 302) {
    this.url = url
    this.status = status
  }

  respond(response: any, driver: IHttpDriver) {
    return driver.respondRedirect(response, this.url, this.status)
  }
}
