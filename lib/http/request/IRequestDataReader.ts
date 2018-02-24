export interface IRequestDataReader {
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
   * returns true if the item is present
   *
   * @param {string} path
   */
  exists(path: string): boolean

  /**
   * gets all items
   */
  all(): Object

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
}
