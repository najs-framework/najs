import { isFunction } from 'lodash'

export type InstanceCreator = () => any

export class ClassRegistryItem {
  className: string
  overridable: boolean
  singleton: boolean
  concreteClassName?: string | undefined
  instanceConstructor?: { new (): any }
  instanceCreator?: InstanceCreator
  instance?: any

  public constructor(
    className: string,
    instanceConstructor?: { new (): any },
    instanceCreator?: InstanceCreator,
    instance?: any,
    overridable?: boolean,
    singleton?: boolean
  ) {
    this.className = className
    this.concreteClassName = undefined
    this.instanceConstructor = instanceConstructor
    this.instanceCreator = instanceCreator
    this.instance = instance
    this.overridable = overridable === false ? false : true
    this.singleton = singleton === true ? true : false
  }

  private createInstance(): any {
    if (isFunction(this.instanceConstructor)) {
      return Object.create(this.instanceConstructor.prototype)
    }
  }

  make<T>(data?: Object): T
  make(data?: Object): any {
    if (this.singleton && this.instance) {
      return this.instance
    }

    let instance: any = this.createInstance()
    if (typeof data !== 'undefined' && isFunction(instance['createClassInstance'])) {
      instance = instance.createClassInstance(data)
    }

    if (this.singleton) {
      this.instance = instance
    }
    return instance
  }
}
