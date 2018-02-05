export interface IRequestRetriever {
  get<T extends any>(name: string): T
  get<T extends any>(name: string, defaultValue: T): T

  has(name: string): boolean

  all(): Object

  only(name: string): Object
  only(names: string[]): Object
  only(...args: Array<string | string[]>): Object

  except(name: string): Object
  except(names: string[]): Object
  except(...args: Array<string | string[]>): Object
}
