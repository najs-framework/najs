import { CookieOptions } from 'express'

export type SetCookieOptions = CookieOptions

export interface ICookie {
  /**
   * Determine the cookie is signed or not
   *
   * @param {string} name
   */
  isSigned(name: string): boolean
  isSigned(names: string[]): boolean
  isSigned(...args: Array<string | string[]>): boolean

  /**
   * gets an item by path
   *
   * @param {string} path
   */
  get<T extends any>(path: string): T
  /**
   * gets an item by path and in case it does not exist returns defaultValue
   *
   * @param {string} path
   * @param {mixed} defaultValue
   */
  get<T extends any>(path: string, defaultValue: T): T

  /**
   * returns true if the item is present and is not falsy values
   *
   * @param {string} path
   */
  has(path: string): boolean
  /**
   * returns true if the item is present and is not falsy values
   *
   * @param {string} path
   * @param {boolean} signed
   */
  has(path: string, signed: boolean): boolean

  /**
   * returns true if the item is present
   *
   * @param {string} path
   */
  exists(path: string): boolean
  /**
   * returns true if the item is present
   *
   * @param {string} path
   * @param {boolean} signed
   */
  exists(path: string, signed: boolean): boolean

  /**
   * gets all items
   */
  all(): Object
  /**
   * gets all items
   *
   * @param {boolean} signed
   */
  all(signed: boolean): Object

  /**
   * gets items defined in params list
   *
   * @param {string} path
   */
  only(path: string): Object
  only(paths: string[]): Object
  only(...args: Array<string | string[]>): Object

  /**
   * gets items which have path not defined in params list
   *
   * @param {string} path
   */
  except(path: string): Object
  except(paths: string[]): Object
  except(...args: Array<string | string[]>): Object

  /**
   * deletes an item by name
   *
   * @param {string} name
   */
  forget(name: string): this
  /**
   * deletes an item by name
   *
   * @param {string} name
   * @param {string} path
   */
  forget(name: string, path: string): this
  /**
   * deletes an item by name
   *
   * @param {string} name
   * @param {string} path
   * @param {string} domain
   */
  forget(name: string, path: string, domain: string): this
  /**
   * deletes an item by name
   *
   * @param {string} name
   * @param {Object} options
   */
  forget(name: string, options: SetCookieOptions): this

  /**
   * makes a cookie
   *
   * @param {string} name
   * @param {mixed} value
   */
  make(name: string, value: any): this
  /**
   * makes a cookie
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   */
  make(name: string, value: any, signed: boolean): this
  /**
   * makes a cookie
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   * @param {number} minutes
   */
  make(name: string, value: any, signed: boolean, minutes: number): this
  /**
   * makes a cookie
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   * @param {number} minutes
   * @param {string} path
   */
  make(name: string, value: any, signed: boolean, minutes: number, path: string): this
  /**
   * makes a cookie
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   * @param {number} minutes
   * @param {string} path
   * @param {string} domain
   */
  make(name: string, value: any, signed: boolean, minutes: number, path: string, domain: string): this
  /**
   * makes a cookie
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   * @param {number} minutes
   * @param {string} path
   * @param {string} domain
   * @param {boolean} secure
   */
  make(name: string, value: any, signed: boolean, minutes: number, path: string, domain: string, secure: boolean): this
  /**
   * makes a cookie
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   * @param {number} minutes
   * @param {string} path
   * @param {string} domain
   * @param {boolean} secure
   * @param {boolean} httpOnly
   */
  make(
    name: string,
    value: any,
    signed: boolean,
    minutes: number,
    path: string,
    domain: string,
    secure: boolean,
    httpOnly: boolean
  ): this
  /**
   * makes a cookie
   *
   * @param {string} name
   * @param {mixed} value
   * @param {Object} options
   */
  make(name: string, value: any, options: SetCookieOptions): this

  /**
   * makes a cookie that lasts "forever" (five years).
   *
   * @param {string} name
   * @param {mixed} value
   */
  forever(name: string, value: any): this
  /**
   * makes a cookie that lasts "forever" (five years).
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   */
  forever(name: string, value: any, signed: boolean): this
  /**
   * makes a cookie that lasts "forever" (five years).
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   * @param {string} path
   */
  forever(name: string, value: any, signed: boolean, path: string): this
  /**
   * makes a cookie that lasts "forever" (five years).
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   * @param {string} path
   * @param {string} domain
   */
  forever(name: string, value: any, signed: boolean, path: string, domain: string): this
  /**
   * makes a cookie that lasts "forever" (five years).
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   * @param {string} path
   * @param {string} domain
   * @param {boolean} secure
   */
  forever(name: string, value: any, signed: boolean, path: string, domain: string, secure: boolean): this
  /**
   * makes a cookie that lasts "forever" (five years).
   *
   * @param {string} name
   * @param {mixed} value
   * @param {boolean} signed
   * @param {string} path
   * @param {string} domain
   * @param {boolean} secure
   * @param {boolean} httpOnly
   */
  forever(
    name: string,
    value: any,
    signed: boolean,
    path: string,
    domain: string,
    secure: boolean,
    httpOnly: boolean
  ): this
  /**
   * makes a cookie that lasts "forever" (five years).
   *
   * @param {string} name
   * @param {mixed} value
   * @param {Object} options
   */
  forever(name: string, value: any, options: SetCookieOptions): this
}
