import { IRequestDataWriter } from './IRequestDataWriter'
import { RequestDataReader } from './RequestDataReader'
import { set, unset } from 'lodash'

export class RequestDataWriter extends RequestDataReader implements IRequestDataWriter {
  set<T extends any>(path: string, value: T): this {
    set(this.data, path, value)
    return this
  }

  put<T extends any>(path: string, value: T): this {
    return this.set(path, value)
  }

  push<T extends any>(path: string, value: T): this {
    return this.set(path, value)
  }

  pull<T extends any>(path: string): T
  pull<T extends any>(path: string, defaultValue: T): T
  pull<T extends any>(path: string, defaultValue?: T): T {
    const value: T = this.get(path, <any>defaultValue)
    this.delete(path)
    return value
  }

  delete(path: string): this {
    unset(this.data, path)
    return this
  }

  remove(path: string): this {
    return this.delete(path)
  }

  forget(path: string): this {
    return this.delete(path)
  }

  clear(): this {
    this.data = {}
    return this
  }

  flush(): this {
    return this.clear()
  }
}
