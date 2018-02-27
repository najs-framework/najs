import { register } from 'najs-binding'
import { ResponseTypeClass } from './../../constants'
import { ViewResponse } from '../../http/response/types/ViewResponse'

export class HandlebarsViewResponse<T extends Object = {}> extends ViewResponse<T> {
  static className: string = ResponseTypeClass.HandlebarsView

  getClassName() {
    return ResponseTypeClass.HandlebarsView
  }

  helper(name: string, fn: Function): this
  helper(names: string[], fn: Function): this
  helper(arg: string | string[], fn: Function): this {
    if (Array.isArray(arg)) {
      for (const name of arg) {
        this.with(`helpers.${name}`, fn)
      }
    } else {
      this.with(`helpers.${arg}`, fn)
    }
    return this
  }
}
register(HandlebarsViewResponse)
