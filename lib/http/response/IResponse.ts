import { IHttpDriver } from '../driver/IHttpDriver'
import { isFunction } from 'lodash'

export interface IResponse {
  respond(response: any, driver: IHttpDriver): void
}

export function isIResponse(arg: any) {
  return typeof arg !== 'undefined' && isFunction(arg.respond)
}
