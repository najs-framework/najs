import { IAutoload, register } from 'najs-binding'
import { ResponseTypeClass } from '../../../constants'
import { IResponse } from '../IResponse'
import { IHttpDriver } from '../../driver/IHttpDriver'

export class JsonpResponse implements IResponse, IAutoload {
  static className: string = ResponseTypeClass.Jsonp
  protected value: any

  constructor(value: any) {
    this.value = value
  }

  getClassName() {
    return ResponseTypeClass.Jsonp
  }

  respond(request: any, response: any, driver: IHttpDriver) {
    return driver.respondJsonp(response, this.value)
  }
}
register(JsonpResponse)
