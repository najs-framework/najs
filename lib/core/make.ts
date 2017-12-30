import get_class_name from './internal/get_class_name'
import RegistryItem from './internal/RegistryItem'
import { ClassRegistry } from './ClassRegistry'
import { isFunction } from 'lodash'

export function make<T>(classDefinition: any): T
export function make<T>(className: string): T
export function make<T>(classDefinition: any, data: Object): T
export function make<T>(className: string, data: Object): T
export function make(className: any, data?: Object): any {
  const name: string = get_class_name(className)
  const symbol: symbol = Symbol.for(name)

  if (Object.getOwnPropertySymbols(ClassRegistry).indexOf(symbol) === -1) {
    throw new ReferenceError(name + ' is not found or not registered yet')
  }

  const registry: RegistryItem = ClassRegistry[symbol]
  const instance: any = Object.create(registry.definition.prototype)
  if (typeof data !== 'undefined' && isFunction(instance['createClassInstance'])) {
    return instance.createClassInstance(data)
  }
  return instance
}
