import { ClassRegistry } from './ClassRegistry'
import { ClassRegistryItem } from '../private/ClassRegistryItem'
import { isString, isFunction } from 'lodash'
import { get_class_name } from '../private/get_class_name'
import { register } from './register'

export type Decorator = (target: any) => any
export type InstanceCreator = () => any

export function bind(bindToClass: string): Decorator
export function bind(className: string, instanceCreator: InstanceCreator): void
export function bind(className: string, concrete: string): void
export function bind(abstract: string, concrete?: string | InstanceCreator): any {
  if (typeof concrete === 'undefined') {
    return function decorator(target: any): any {
      const targetName = get_class_name(target)
      if (!ClassRegistry.has(targetName)) {
        register(target, targetName)
      }
      bind(abstract, targetName)
    }
  }

  if (ClassRegistry.has(abstract)) {
    ClassRegistry.assertRegistryItemCouldBeUpdated(abstract)
    const item: ClassRegistryItem = ClassRegistry.findOrFail(abstract)
    if (isFunction(concrete)) {
      item.instanceCreator = concrete
      return ClassRegistry.register(item)
    }
    item.concreteClassName = concrete
    return ClassRegistry.register(item)
  }

  const item: ClassRegistryItem = new ClassRegistryItem(
    abstract,
    undefined,
    isFunction(concrete) ? concrete : undefined,
    undefined,
    undefined,
    undefined
  )
  if (isString(concrete)) {
    item.concreteClassName = concrete
  }
  return ClassRegistry.register(item)
}
