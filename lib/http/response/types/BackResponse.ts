import { IResponse } from '../IResponse'
import { IHttpDriver } from '../../driver/IHttpDriver'

export class BackResponse implements IResponse {
  protected defaultUrl: string

  constructor(defaultUrl?: string)
  constructor(defaultUrl: string = '/') {
    this.defaultUrl = defaultUrl
  }

  respond(request: any, response: any, driver: IHttpDriver) {
    let url: string = request.header('Referer')
    if (!url) {
      url = this.defaultUrl
    }
    return driver.respondRedirect(response, url, 302)
  }
}
