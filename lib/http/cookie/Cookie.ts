/// <reference path="../../contracts/Cookie.ts" />

import { Najs } from '../../constants'
import { register } from 'najs-binding'
import { ContextualFacade } from 'najs-facade'
import { Controller } from '../controller/Controller'
import { RequestDataReader } from '../request/RequestDataReader'
import { ExpressController } from '../controller/ExpressController'
import { has, get, flatten } from 'lodash'
import { Request, Response } from 'express'

export interface Cookie extends Najs.Contracts.Cookie {}
export class Cookie extends ContextualFacade<Controller> implements Najs.Contracts.Cookie {
  protected data: Object
  protected cookies: Object
  protected signedCookies: Object

  constructor(controller: Controller) {
    super(controller)
    controller.cookie = this
    if (controller instanceof ExpressController) {
      const request: Request = (controller as ExpressController).request
      this.data = Object.assign({}, request.cookies, request.signedCookies)
      this.cookies = request.cookies
      this.signedCookies = request.signedCookies
    }
  }

  getClassName() {
    return Najs.Http.Cookie
  }

  protected getResponse(): Response {
    return (this.context as ExpressController).response
  }

  isSigned(...args: Array<string | string[]>): boolean {
    const paths: string[] = flatten(args)
    for (const path of paths) {
      if (!this.signedCookies[path]) {
        return false
      }
    }
    return true
  }

  has(path: string, signed?: boolean): boolean {
    if (signed === true) {
      return has(this.signedCookies, path) && !!get(this.signedCookies, path)
    }
    if (signed === false) {
      return has(this.cookies, path) && !!get(this.cookies, path)
    }
    return RequestDataReader.prototype.has.apply(this, arguments)
  }

  exists(path: string, signed?: boolean): boolean {
    if (signed === true) {
      return has(this.signedCookies, path)
    }
    if (signed === false) {
      return has(this.cookies, path)
    }
    return RequestDataReader.prototype.exists.apply(this, arguments)
  }

  all(signed?: boolean): Object {
    if (signed === true) {
      return this.signedCookies
    }
    if (signed === false) {
      return this.cookies
    }
    return this.data
  }

  forget(name: string, arg1?: Najs.Http.CookieOptions | string, arg2?: string): this {
    if (typeof arg1 === 'undefined') {
      this.getResponse().clearCookie(name)
      return this
    }

    const opts: Najs.Http.CookieOptions = typeof arg1 === 'object' ? arg1 : {}

    if (typeof arg1 === 'string') {
      opts.path = arg1
    }
    if (typeof arg2 === 'string') {
      opts.domain = arg2
    }

    this.getResponse().clearCookie(name, opts)
    return this
  }

  make(
    name: string,
    value: any,
    optionsOrSigned: boolean | Najs.Http.CookieOptions = false,
    minutes: number = 0,
    path: string | undefined = undefined,
    domain: string | undefined = undefined,
    secure: boolean | undefined = undefined,
    httpOnly: boolean | undefined = undefined
  ): this {
    if (typeof optionsOrSigned === 'object') {
      this.getResponse().cookie(name, value, optionsOrSigned)
      return this
    }

    const opts: Najs.Http.CookieOptions = { signed: optionsOrSigned }
    if (minutes > 0) {
      opts.maxAge = minutes * 60 * 1000
    }
    if (typeof path !== 'undefined') {
      opts.path = path
    }
    if (typeof domain !== 'undefined') {
      opts.domain = domain
    }
    if (typeof secure !== 'undefined') {
      opts.secure = secure
    }
    if (typeof httpOnly !== 'undefined') {
      opts.httpOnly = httpOnly
    }
    this.getResponse().cookie(name, value, opts)
    return this
  }

  forever(
    name: string,
    value: any,
    optionsOrSigned: boolean | Najs.Http.CookieOptions = false,
    path: string | undefined = undefined,
    domain: string | undefined = undefined,
    secure: boolean | undefined = undefined,
    httpOnly: boolean | undefined = undefined
  ): this {
    if (typeof optionsOrSigned === 'object') {
      // 5 years: 1000 x 60 x 60 x 24 x 365 x 5
      optionsOrSigned.maxAge = 157680000000
      return this.make(name, value, optionsOrSigned)
    }
    return this.make(name, value, optionsOrSigned, 157680000000, <any>path, <any>domain, <any>secure, <any>httpOnly)
  }
}

// implements IRequestDataReader implicitly
const IRequestDataReaderFunctions = ['get', 'only', 'except']
for (const name of IRequestDataReaderFunctions) {
  Cookie.prototype[name] = function() {
    return RequestDataReader.prototype[name].apply(this, arguments)
  }
}

register(Cookie, Najs.Http.Cookie)
