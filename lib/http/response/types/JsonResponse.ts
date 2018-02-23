import { IAutoload } from '../../../core/IAutoload'
import { register } from '../../../core/register'
import { ResponseTypeClass } from '../../../constants'
import { IResponse } from '../IResponse'
import { IHttpDriver } from '../../driver/IHttpDriver'

export class JsonResponse implements IResponse, IAutoload {
  static className: string = ResponseTypeClass.Json
  protected value: any

  constructor(value: any) {
    this.value = value
  }

  getClassName() {
    return ResponseTypeClass.Json
  }

  respond(request: any, response: any, driver: IHttpDriver) {
    return driver.respondJson(response, this.value)
  }
}
register(JsonResponse)
