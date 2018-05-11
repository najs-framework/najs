/// <reference path="../../contracts/HttpDriver.ts" />

import { IncomingMessage, ServerResponse } from 'http'
import { isFunction } from 'lodash'

export interface IResponse {
  respond(request: IncomingMessage, response: ServerResponse, driver: Najs.Contracts.HttpDriver<any, any>): void
}

export function isIResponse(arg: any) {
  return typeof arg !== 'undefined' && isFunction(arg.respond)
}
