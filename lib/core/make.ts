import { get_class_name } from '../private/get_class_name'
import { ClassRegistryItem } from '../private/ClassRegistryItem'
import { ClassRegistry } from './ClassRegistry'
import { isFunction } from 'lodash'

/**
 * `make` a class instance
 *
 * @param {class|function} classDefinition - class definition
 */
export function make<T>(classDefinition: any): T
/**
 * `make` a class instance from registered class's name
 *
 * @param {string} className - the registered class name
 */
export function make<T>(className: string): T
/**
 * `make` a class instance with data
 *
 * @param {class|function} classDefinition - class definition
 * @param {Object} data - filled data to instance
 */
export function make<T>(classDefinition: any, data: Object): T
/**
 * `make` a class instance from registered class's name with data
 *
 * @param {class|function} classDefinition - class definition
 * @param {Object} data - filled data to instance
 */
export function make<T>(className: string, data: Object): T
export function make(className: any, data?: Object): any {
  const name: string = get_class_name(className)
  const symbol: symbol = Symbol.for(name)

  if (Object.getOwnPropertySymbols(ClassRegistry).indexOf(symbol) === -1) {
    throw new ReferenceError(name + ' is not found or not registered yet')
  }

  const registry: ClassRegistryItem = ClassRegistry[symbol]
  if (registry.singleton && registry.instance) {
    return registry.instance
  }

  let instance: any = Object.create(registry.definition.prototype)
  if (typeof data !== 'undefined' && isFunction(instance['createClassInstance'])) {
    instance = instance.createClassInstance(data)
  }

  if (registry.singleton) {
    registry.instance = instance
  }
  return instance
}
