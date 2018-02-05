import { IRequestRetriever } from './IRequestRetriever'
import { flatten } from 'lodash'

export class RequestData implements IRequestRetriever {
  protected data: Object

  constructor(data: Object) {
    this.data = data
  }

  get<T extends any>(name: string): T
  get<T extends any>(name: string, defaultValue: T): T
  get<T extends any>(name: string, defaultValue?: T): T {
    if (defaultValue && !this.data[name]) {
      return defaultValue
    }
    return this.data[name]
  }

  has(name: string): boolean {
    return this.data.hasOwnProperty(name)
  }

  all(): Object {
    return this.data
  }

  only(name: string): Object
  only(names: string[]): Object
  only(...args: Array<string | string[]>): Object
  only(...args: Array<string | string[]>): Object {
    const fields = flatten(args)
    return Object.keys(this.data).reduce((memo: Object, key: string) => {
      if (fields.indexOf(key) !== -1) {
        memo[key] = this.data[key]
      }
      return memo
    }, {})
  }

  except(name: string): Object
  except(names: string[]): Object
  except(...args: Array<string | string[]>): Object
  except(...args: Array<string | string[]>): Object {
    const fields = flatten(args)
    return Object.keys(this.data).reduce((memo: Object, key: string) => {
      if (fields.indexOf(key) === -1) {
        memo[key] = this.data[key]
      }
      return memo
    }, {})
  }
}
