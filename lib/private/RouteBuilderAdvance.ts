import { IRoute } from '../http/IRoute'
import { IRouteData } from '../http/IRouteData'
import { RouteBuilder } from './RouteBuilder'

export class RouteBuilderAdvance extends RouteBuilder {
  protected children: Array<IRoute>

  constructor(method: string, path: string) {
    super(method, path)
    this.children = []
  }

  getRouteData(): IRouteData {
    return this.data
  }

  registerChildRoute(route: IRoute): void {
    if (this.children.length === 0) {
      this.children.push(route)
      return
    }

    const lastChild = this.children[this.children.length - 1]
    if (lastChild.shouldRegisterChildRoute()) {
      lastChild.registerChildRoute(route)
      return
    }

    this.children.push(route)
  }

  shouldRegisterChildRoute(): boolean {
    if (!this.data.metadata) {
      return false
    }
    return this.data.metadata['grouped'] === true
  }

  hasChildRoute(): boolean {
    return this.children.length === 0
  }

  // -------------------------------------------------------------------------------------------------------------------

  middleware(middleware: string): RouteBuilderAdvance {
    this.data.middleware.push(middleware)
    return this
  }

  prefix(prefix: string): RouteBuilderAdvance {
    this.data.prefix = prefix
    return this
  }

  get(path: string): RouteBuilder {
    this.data.method = 'GET'
    this.data.path = path
    return this
  }

  post(path: string): RouteBuilder {
    this.data.method = 'POST'
    this.data.path = path
    return this
  }

  group(callback: () => void): void {
    if (!this.data.metadata) {
      this.data.metadata = {}
    }
    this.data.metadata['grouped'] = true
    callback.call(undefined)
    delete this.data.metadata['grouped']
  }
}
