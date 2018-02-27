import { register } from 'najs-binding'
import { ResponseTypeClass } from './../../constants'
import { ViewResponse } from '../../http/response/types/ViewResponse'

export class HandlebarsViewResponse<T extends Object = {}> extends ViewResponse {
  static className: string = ResponseTypeClass.HandlebarsView

  constructor(view: string)
  constructor(view: string, variables: T)
  constructor(view: string, variables?: T) {
    console.log('arguments', arguments)
    super(view, <any>variables)
  }

  getClassName() {
    return ResponseTypeClass.HandlebarsView
  }

  helper(name: string, fn: Function) {
    this.with(`helpers.${name}`, fn)
  }
}
register(HandlebarsViewResponse)
