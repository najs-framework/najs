import { ClassRegistry } from './../core/ClassRegistry'
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

  private createInstance(args?: any[]): any {
    if (this.concreteClassName) {
      if (ClassRegistry.has(this.concreteClassName)) {
        return ClassRegistry.findOrFail(this.concreteClassName).createInstance()
      }
      return undefined
    }
    if (isFunction(this.instanceConstructor)) {
      return Reflect.construct(this.instanceConstructor, args || [])
    }
    if (isFunction(this.instanceCreator)) {
      return this.instanceCreator.call(undefined)
    }
    if (this.singleton) {
      return this.instance
    }
    return undefined
  }

  /*
   * - Najs.Service
   * - Najs.Routing = instanceCreator()
   * + Najs.Repository [= instanceCreator(), { singleton }]
   * |--> Najs.RepositoryCached
   * - Najs.ServiceFinal { overridable: false }
   * + Level1
   * |--+ Level2
   *    |--> Final = instanceCreator()
   */
  /* Class Maps:
   *
   *   - Najs.Service
   *   - Najs.Routing = instanceCreator()
   *   - Najs.Repository ---> Najs.RepositoryCached
   *   - Level1 ---> Level2 ---> Level3
   *   - Najs.ServiceFinal [!overridable]
   *   - Najs.Singleton [singleton, !overridable]
   *   - PrimitiveBind {
   *        const service    = Najs.Service
   *        const repository = Najs.Repository ---> Najs.RepositoryCached
   *     }
   *   - Najs.Singleton [singleton, !overridable]
   */
  // getInformation() {
  //   const info = {
  //     name: this.className,
  //     bound: false,
  //     concrete: '',
  //     overridable: this.overridable,
  //     singleton: this.singleton,
  //     useInstanceCreator: false
  //   }
  //   if (this.concreteClassName) {
  //     info.bound = true
  //     info.concrete = this.concreteClassName
  //   }
  //   if (isFunction(this.instanceCreator)) {
  //     info.useInstanceCreator = true
  //   }
  //   return info
  // }

  make<T>(): T
  make<T>(data: Object): T
  make<T>(args: any[]): T
  make(arg?: Object | any[]): any {
    if (this.singleton && this.instance) {
      return this.instance
    }

    let instance: any
    if (Array.isArray(arg)) {
      instance = this.createInstance(arg)
    } else {
      instance = this.createInstance()
      if (typeof arg !== 'undefined' && isFunction(instance['createClassInstance'])) {
        instance = instance.createClassInstance(arg)
      }
    }

    if (this.singleton) {
      this.instance = instance
    }
    return instance
  }
}
