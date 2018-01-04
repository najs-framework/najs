import { ClassRegistry } from './ClassRegistry'
import { ClassRegistryItem } from '../private/ClassRegistryItem'
import { isString, isFunction } from 'lodash'

export type Decorator = (target: any) => any
export type InstanceCreator = () => any

export function bind(className: string): Decorator
export function bind(className: string, instanceCreator: InstanceCreator): void
export function bind(className: string, concrete: string): void
export function bind(abstract: string, concrete?: string | InstanceCreator): any {
  if (ClassRegistry.has(abstract)) {
    ClassRegistry.assertRegistryItemCouldBeUpdated(abstract)
    const item: ClassRegistryItem = ClassRegistry.findOrFail(abstract)
    if (isString(concrete)) {
      item.concreteClassName = concrete
    } else {
      item.instanceCreator = concrete
    }
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
