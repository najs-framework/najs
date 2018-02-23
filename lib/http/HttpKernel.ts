import { IAutoload, make, register } from 'najs-binding'
import { IMiddleware } from './middleware/IMiddleware'
import { isString } from 'lodash'
import { SystemClass } from '../constants'

export class HttpKernel implements IAutoload {
  protected middleware: {
    [key: string]: string | string[]
  } = {}

  getClassName(): string {
    return SystemClass.HttpKernel
  }

  getMiddleware(name: string): IMiddleware[] {
    const result: IMiddleware[] = []
    if (Array.isArray(this.middleware[name])) {
      const middlewareList: string[] = <string[]>this.middleware[name]
      middlewareList.forEach((className: string) => {
        const middleware = make(className)
        if (middleware) {
          result.push(middleware)
        }
      })
    }

    if (isString(this.middleware[name])) {
      const middleware = make(this.middleware[name])
      if (middleware) {
        result.push(middleware)
      }
    }
    return result
  }
}

register(HttpKernel)
