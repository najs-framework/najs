/// <reference path="../../contracts/HttpDriver.ts" />
/// <reference path="../../contracts/Response.ts" />

import { register } from 'najs-binding'
import { Najs } from '../../constants'
import { IView } from './IViewGrammars'
import { set } from 'lodash'

export class ViewResponse<T extends Object = {}> implements Najs.Contracts.Response, IView {
  static className: string = Najs.Http.Response.ViewResponse
  protected view: string
  protected variables: T

  constructor(view: string)
  constructor(view: string, variables: T)
  constructor(view: string, variables?: T) {
    this.view = view
    this.variables = variables || <T>{}
  }

  getClassName() {
    return Najs.Http.Response.ViewResponse
  }

  respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>) {
    return driver.respondView(response, this.view, this.variables)
  }

  with(name: string, value: any): this {
    set(this.variables, name, value)
    return this
  }

  getVariables(): T {
    return this.variables
  }
}
register(ViewResponse, Najs.Http.Response.ViewResponse)
