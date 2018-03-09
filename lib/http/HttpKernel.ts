import { BodyParserMiddleware } from './middleware/BodyParserMiddleware'
import { ExpressCorsMiddleware } from './middleware/ExpressCorsMiddleware'
import { ExpressCsurfMiddleware } from './middleware/ExpressCsurfMiddleware'
import { SessionMiddleware } from './middleware/SessionMiddleware'
import { CookieMiddleware } from './middleware/CookieMiddleware'
import { RequestDataMiddleware } from './middleware/RequestDataMiddleware'
import { InputHandlebarsHelperMiddleware } from './middleware/InputHandlebarsHelperMiddleware'
import { BodyHandlebarsHelperMiddleware } from './middleware/BodyHandlebarsHelperMiddleware'
import { QueryHandlebarsHelperMiddleware } from './middleware/QueryHandlebarsHelperMiddleware'
import { ParamsHandlebarsHelperMiddleware } from './middleware/ParamsHandlebarsHelperMiddleware'
import { IAutoload, make, register } from 'najs-binding'
import { IMiddleware } from './middleware/IMiddleware'
import { isString } from 'lodash'
import { SystemClass } from '../constants'
import { AuthMiddleware } from './middleware/AuthMiddleware'

export class HttpKernel implements IAutoload {
  protected globalMiddleware: {
    [key: string]: string | string[]
  } = {
    default: [
      BodyParserMiddleware.className,
      CookieMiddleware.className,
      ExpressCsurfMiddleware.className,
      RequestDataMiddleware.className,
      SessionMiddleware.className
    ],
    auth: AuthMiddleware.className,
    cors: ExpressCorsMiddleware.className,
    csrf: ExpressCsurfMiddleware.className,
    session: SessionMiddleware.className,
    cookie: CookieMiddleware.className,
    'body-parser': BodyParserMiddleware.className,
    'input-helper': InputHandlebarsHelperMiddleware.className,
    'body-helper': BodyHandlebarsHelperMiddleware.className,
    'query-helper': QueryHandlebarsHelperMiddleware.className,
    'params-helper': ParamsHandlebarsHelperMiddleware.className,
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
    const params: string[] = []
    const index: number = name.indexOf(':')
    if (index !== -1) {
      params.push(name.substr(index + 1))
      name = name.substr(0, index)
    }

    const middlewareSettings = this.findMiddlewareByName(name)
    if (Array.isArray(middlewareSettings)) {
      const middlewareList: string[] = <string[]>middlewareSettings
      middlewareList.forEach((className: string) => {
        const middleware: IMiddleware | undefined = make(className, params)
        if (middleware) {
          result.push(middleware)
        }
      })
    }

    if (isString(middlewareSettings)) {
      const middleware: IMiddleware | undefined = make(middlewareSettings, params)
      if (middleware) {
        result.push(middleware)
      }
    }
    return result
  }
}

register(HttpKernel)
