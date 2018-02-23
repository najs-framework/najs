import { IAutoload, register } from 'najs-binding'
import { ResponseTypeClass } from '../../../constants'
import { IView } from './IViewGrammars'
import { IResponse } from '../IResponse'
import { IHttpDriver } from '../../driver/IHttpDriver'

export class ViewResponse<T extends Object = {}> implements IResponse, IAutoload, IView {
  static className: string = ResponseTypeClass.View
  protected view: string
  protected variables: T

  constructor(view: string)
  constructor(view: string, variables: T)
  constructor(view: string, variables?: T) {
    this.view = view
    this.variables = variables || <T>{}
  }

  getClassName() {
    return ResponseTypeClass.View
  }

  respond(request: any, response: any, driver: IHttpDriver) {
    return driver.respondView(response, this.view, this.variables)
  }

  with(name: string, value: any): this {
    this.variables[name] = value
    return this
  }

  getVariables(): T {
    return this.variables
  }
}
register(ViewResponse)
