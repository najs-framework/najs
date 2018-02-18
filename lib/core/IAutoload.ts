export interface IAutoload {
  getClassName(): string
  createClassInstance?(data?: Object): any
}

export interface IAutoloadMetadata<T> {
  __autoloadMetadata: T
}
