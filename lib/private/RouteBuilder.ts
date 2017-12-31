import { IRoute } from '../http/IRoute'
import { IRouteData } from '../http/IRouteData'

export class RouteBuilder implements IRoute {
  protected data: IRouteData

  constructor(method: string, path: string) {
    this.data = {
      name: '',
      method: method,
      path: path,
      prefix: '',
      controller: '',
      endpoint: '',
      middleware: []
    }
  }

  getRouteData(): IRouteData {
    return this.data
  }

  registerChildRoute(route: IRoute): void {}

  shouldRegisterChildRoute(): boolean {
    return false
  }

  hasChildRoute(): boolean {
    return false
  }

  // -------------------------------------------------------------------------------------------------------------------

  name(name: string): this {
    this.data.name = name
    return this
  }

  validateInput(): this {
    return this
  }
}
