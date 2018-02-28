import { ExpressCorsMiddleware } from './middleware/ExpressCorsMiddleware'
import { ExpressCsurfMiddleware } from './middleware/ExpressCsurfMiddleware'
import { SessionMiddleware } from './middleware/SessionMiddleware'
import { RequestDataMiddleware } from './middleware/RequestDataMiddleware'
import { InputMiddleware } from './middleware/InputMiddleware'
import { BodyMiddleware } from './middleware/BodyMiddleware'
import { QueryMiddleware } from './middleware/QueryMiddleware'
import { ParamsMiddleware } from './middleware/ParamsMiddleware'
import { IAutoload, make, register } from 'najs-binding'
import { IMiddleware } from './middleware/IMiddleware'
import { isString } from 'lodash'
import { SystemClass } from '../constants'

export class HttpKernel implements IAutoload {
  protected globalMiddleware: {
    [key: string]: string | string[]
  } = {
    default: [ExpressCsurfMiddleware.className, SessionMiddleware.className, RequestDataMiddleware.className],
    cors: ExpressCorsMiddleware.className,
    csrf: ExpressCsurfMiddleware.className,
    session: SessionMiddleware.className,
    input: InputMiddleware.className,
    body: BodyMiddleware.className,
    query: QueryMiddleware.className,
    params: ParamsMiddleware.className,
    'request-data': RequestDataMiddleware.className
  }

  protected middleware: {
    [key: string]: string | string[]
  } = {}

  protected findMiddlewareByName(name: string): string | string[] | undefined {
    if (typeof this.middleware[name] !== 'undefined') {
      return this.middleware[name]
    }

    if (typeof this.globalMiddleware[name] !== 'undefined') {
      return this.globalMiddleware[name]
    }

    return undefined
  }

  getClassName(): string {
    return SystemClass.HttpKernel
  }

  getMiddleware(name: string): IMiddleware[] {
    const result: IMiddleware[] = []
    const middlewareSettings = this.findMiddlewareByName(name)
    if (Array.isArray(middlewareSettings)) {
      const middlewareList: string[] = <string[]>middlewareSettings
      middlewareList.forEach((className: string) => {
        const middleware = make(className)
        if (middleware) {
          result.push(middleware)
        }
      })
    }

    if (isString(middlewareSettings)) {
      const middleware = make(middlewareSettings)
      if (middleware) {
        result.push(middleware)
      }
    }
    return result
  }
}

register(HttpKernel)
