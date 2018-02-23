import { IHttpDriver } from '../driver/IHttpDriver'
import { IncomingMessage, ServerResponse } from 'http'
import { isFunction } from 'lodash'

export interface IResponse {
  respond(request: IncomingMessage, response: ServerResponse, driver: IHttpDriver): void
}

export function isIResponse(arg: any) {
  return typeof arg !== 'undefined' && isFunction(arg.respond)
}
