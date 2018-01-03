import { get_class_name } from '../private/get_class_name'
import { ClassRegistry } from './ClassRegistry'

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
  return ClassRegistry.findOrFail(get_class_name(className)).make(data)
}
