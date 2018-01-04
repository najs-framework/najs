import { register } from './register'
import { isString } from 'lodash'

export type Decorator = (target: any) => any

/**
 * Decorator to register a class.
 *
 * @returns {decorator}
 */
export function singleton(): Decorator
/**
 * Decorator to register a class with custom class name
 *
 * @param {string} className - the custom class name.
 * @returns {decorator}
 */
export function singleton(className: string): Decorator
/**
 * Register class to ClassRegistry, we can use `make` to create an instance of this class later
 *
 * @param {class|function} classDefinition - class definition
 */
export function singleton<T>(classDefinition: T): void
/**
 * Register class to ClassRegistry with custom name
 *
 * @param {class|function} classDefinition - class definition
 * @param {string} className - custom class name
 */
export function singleton<T>(classDefinition: T, className: string): void
/**
 * Register class to ClassRegistry with custom name and overridable setting
 *
 * @param {class|function} classDefinition - class definition
 * @param {string} className - custom class name
 * @param {boolean} overridable - if true this class could not be registered again
 */
export function singleton<T>(classDefinition: T, className: string, overridable: boolean): void
export function singleton(classDefinition?: any, className?: any, overridable?: boolean): void | Decorator {
  if (typeof classDefinition === 'undefined' || isString(classDefinition)) {
    return function decorator(target: any): any {
      register(target, <string>classDefinition, false, true)
    }
  }
  return register(classDefinition, className, <boolean>overridable, true)
}
