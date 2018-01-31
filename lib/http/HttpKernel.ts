import { IAutoload } from '../core/IAutoload'
import { IMiddleware } from './middleware/IMiddleware'
import { make } from '../core/make'
import { isString } from 'lodash'
import { register } from '../core/register'

export class HttpKernel implements IAutoload {
  static className: string = 'HttpKernel'

  protected middleware: {
    [key: string]: string | string[]
  } = {}

  getClassName(): string {
    return HttpKernel.className
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
