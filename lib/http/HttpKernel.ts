import { PoweredByMiddleware as PoweredBy } from './middleware/built-ins/PoweredByMiddleware'
import { RequestIdMiddleware as RequestId } from './middleware/built-ins/RequestIdMiddleware'
import { StaticMiddleware as Static } from './middleware/built-ins/StaticMiddleware'
import { CorsMiddleware as Cors } from './middleware/built-ins/CorsMiddleware'
import { CsurfMiddleware as Csurf } from './middleware/built-ins/CsurfMiddleware'
import { SessionMiddleware as Session } from './middleware/built-ins/SessionMiddleware'
import { CookieMiddleware as Cookie } from './middleware/built-ins/CookieMiddleware'

import { BodyParserMiddleware } from './middleware/BodyParserMiddleware'
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
import { isPlainObject, flatten } from 'lodash'

export type MiddlewareGroupDefinition = {
  [key: string]: string | string[]
}

export type MiddlewareDefinition = {
  [key: string]: string | string[] | MiddlewareGroupDefinition
}

export class HttpKernel implements IAutoload {
  protected globalMiddleware: MiddlewareDefinition = {
    core: {
      'powered-by:Najs/Express': PoweredBy.className,
      'request-id': RequestId.className
    },
    web: {
      'powered-by:Najs/Express': PoweredBy.className,
      'request-id': RequestId.className,
      static: Static.className,
      'body-parser': BodyParserMiddleware.className,
      'cookie-parser': Cookie.className,
      'request-data': RequestDataMiddleware.className,
      csrf: Csurf.className,
      session: Session.className
    },
    auth: AuthMiddleware.className,
    cors: Cors.className,
    csrf: Csurf.className,
    csurf: Csurf.className,
    session: Session.className,
    cookie: Cookie.className,
    static: Static.className,
    'body-parser': BodyParserMiddleware.className,
    'input-helper': InputHandlebarsHelperMiddleware.className,
    'body-helper': BodyHandlebarsHelperMiddleware.className,
    'query-helper': QueryHandlebarsHelperMiddleware.className,
    'params-helper': ParamsHandlebarsHelperMiddleware.className,
    'request-id': RequestId.className,
    'request-data': RequestDataMiddleware.className
  }

  protected middleware: MiddlewareDefinition = {}

  protected findMiddlewareByName(name: string): string | string[] | MiddlewareGroupDefinition | undefined {
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
    const params: string[] = name.split(':')
    const className = params[0]

    const middlewareSettings = this.findMiddlewareByName(className)
    if (isPlainObject(middlewareSettings)) {
      return this.createGroupMiddleware(<MiddlewareGroupDefinition>middlewareSettings)
    }
    return this.createMiddleware(<string | string[]>middlewareSettings, className, params)
  }

  protected createGroupMiddleware(settings: MiddlewareGroupDefinition): IMiddleware[] {
    const result: IMiddleware[][] = []
    for (const name in settings) {
      const params: string[] = name.split(':')
      const className = params[0]
      result.push(this.createMiddleware(settings[name], className, params))
    }
    return flatten(result)
  }

  protected createMiddleware(settings: string[] | string, className: string, params: string[]) {
    const result: IMiddleware[] = []
    if (Array.isArray(settings)) {
      const middlewareList: string[] = <string[]>settings
      middlewareList.forEach((className: string) => {
        const middleware: IMiddleware | undefined = make(className, params)
        if (middleware) {
          result.push(middleware)
        }
      })
    }

    if (isString(settings)) {
      const middleware: IMiddleware | undefined = make(settings, params)
      if (middleware) {
        result.push(middleware)
      }
    }
    return result
  }
}

register(HttpKernel)
