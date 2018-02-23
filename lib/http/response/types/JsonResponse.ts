import { IResponse } from '../IResponse'
import { IHttpDriver } from '../../driver/IHttpDriver'

export class JsonResponse implements IResponse {
  protected value: any

  constructor(value: any) {
    this.value = value
  }

  respond(request: any, response: any, driver: IHttpDriver) {
    return driver.respondJson(response, this.value)
  }
}
