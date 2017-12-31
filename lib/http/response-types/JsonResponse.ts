import { IResponse } from '../IResponse'
import { IHttpDriver } from '../IHttpDriver'

export class JsonResponse implements IResponse {
  private value: any

  constructor(value: any) {
    this.value = value
  }

  respond(response: any, driver: IHttpDriver) {
    return driver.respondJson(response, this.value)
  }
}
