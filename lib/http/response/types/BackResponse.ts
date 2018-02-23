import { IAutoload } from '../../../core/IAutoload'
import { register } from '../../../core/register'
import { ResponseTypeClass } from '../../../constants'
import { IResponse } from '../IResponse'
import { IHttpDriver } from '../../driver/IHttpDriver'

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

  respond(request: any, response: any, driver: IHttpDriver) {
    let url: string = request.header('Referer')
    if (!url) {
      url = this.defaultUrl
    }
    return driver.respondRedirect(response, url, 302)
  }
}
register(BackResponse)
