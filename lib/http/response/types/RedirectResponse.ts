import { IAutoload } from '../../../core/IAutoload'
import { register } from '../../../core/register'
import { ResponseTypeClass } from '../../../constants'
import { IResponse } from '../IResponse'
import { IHttpDriver } from '../../driver/IHttpDriver'

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

  respond(request: any, response: any, driver: IHttpDriver) {
    return driver.respondRedirect(response, this.url, this.status)
  }
}
register(RedirectResponse)
