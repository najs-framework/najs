import { IRequestDataReader } from './IRequestDataReader'
import { get, set, unset, has, flatten } from 'lodash'

export class RequestDataReader implements IRequestDataReader {
  protected data: Object

  constructor(data: Object) {
    this.data = data
  }

  get<T extends any>(path: string): T
  get<T extends any>(path: string, defaultValue: T): T
  get<T extends any>(path: string, defaultValue?: T): T {
    return get(this.data, path, defaultValue)
  }

  has(path: string): boolean {
    return has(this.data, path) && !!get(this.data, path)
  }

  exists(path: string): boolean {
    return has(this.data, path)
  }

  all(): Object {
    return this.data
  }

  only(path: string): Object
  only(paths: string[]): Object
  only(...args: Array<string | string[]>): Object
  only(...args: Array<string | string[]>): Object {
    const paths: string[] = flatten(args)
    return paths.reduce((memo: Object, path: string) => {
      set(memo, path, get(this.data, path))
      return memo
    }, {})
  }

  except(path: string): Object
  except(paths: string[]): Object
  except(...args: Array<string | string[]>): Object
  except(...args: Array<string | string[]>): Object {
    const paths: string[] = flatten(args)
    return paths.reduce((memo: Object, path: string) => {
      unset(memo, path)
      return memo
    }, Object.assign({}, this.data))
  }
}
