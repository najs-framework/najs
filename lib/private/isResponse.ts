import { isFunction } from 'lodash'

export function isResponse(arg: any) {
  return typeof arg !== 'undefined' && isFunction(arg.respond)
}
