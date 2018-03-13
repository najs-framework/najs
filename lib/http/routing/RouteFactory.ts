import { IAutoload, register } from 'najs-binding'
import { Facade } from 'najs-facade'
import { GlobalFacadeClass } from '../../constants'
import { RouteCollection } from './RouteCollection'
import { RouteBuilder } from './RouteBuilder'
import { IRouteGenerateUrl } from './interfaces/IRouteGenerateUrl'
import { IRouteData } from './interfaces/IRouteData'
import * as PathToRegex from 'path-to-regexp'
import { IRouteFactory, IRouteFactoryConstructor } from './interfaces/IRouteFactory'

class RouteFactoryClass extends Facade implements IRouteGenerateUrl, IAutoload {
  protected proxy: any

  constructor() {
    super()
    return this.createProxy()
  }

  protected createProxy() {
    this.proxy = new Proxy(this, {
      get(target: RouteFactoryClass, key: string): any {
        if (key !== 'hasOwnProperty' && typeof RouteBuilder.prototype[key] === 'function') {
          return function() {
            return RouteCollection.register<RouteBuilder>(new RouteBuilder())[key](...arguments)
          }
        }
        return target[key]
      }
    })
    return this.proxy
  }

  getClassName() {
    return GlobalFacadeClass.Route
  }

  createByName(name: string): string
  createByName(name: string, param: Object): string
  createByName(name: string, param: Object, options: { encode: (value: string) => string }): string
  createByName(name: string, param?: Object, options?: { encode: (value: string) => string }): string {
    const route: IRouteData = RouteCollection.findOrFail(name)
    const toPath = PathToRegex.compile(route.prefix + route.path)
    return toPath(param, options)
  }

  // redirect(...args: Array<any>): void {}
}
register(RouteFactoryClass)

export const RouteFactory: IRouteFactory & IRouteFactoryConstructor = <any>RouteFactoryClass
