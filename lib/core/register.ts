import { get_class_name } from '../private/get_class_name'
import { ClassRegistryItem } from '../private/ClassRegistryItem'
import { ClassRegistry } from './ClassRegistry'
import { isString } from 'lodash'

export type Decorator = (target: any) => any

/**
 * Decorator to register a class.
 *
 * @returns {decorator}
 */
export function register(): Decorator
/**
 * Decorator to register a class with custom class name
 *
 * @param {string} className - the custom class name.
 * @returns {decorator}
 */
export function register(className: string): Decorator
/**
 * Register class to ClassRegistry, we can use `make` to create an instance of this class later
 *
 * @param {class|function} classDefinition - class definition
 */
export function register<T>(classDefinition: T): void
/**
 * Register class to ClassRegistry with custom name
 *
 * @param {class|function} classDefinition - class definition
 * @param {string} className - custom class name
 */
export function register<T>(classDefinition: T, className: string): void
/**
 * Register class to ClassRegistry with custom name and overridable setting
 *
 * @param {class|function} classDefinition - class definition
 * @param {string} className - custom class name
 * @param {boolean} overridable - if true this class could not be registered again
 */
export function register<T>(classDefinition: T, className: string, overridable: boolean): void
/**
 * Register class to ClassRegistry with custom name, overridable and singleton setting
 *
 * @param {class|function} classDefinition - class definition
 * @param {string} className - custom class name
 * @param {boolean} overridable - if true this class could not be registered again
 * @param {boolean} singleton - if true `make` creates only one instance and reuse for every calls
 */
export function register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): void
export function register(
  classDefinition?: any,
  className?: any,
  overridable?: boolean,
  singleton?: boolean
): void | Decorator {
  if (typeof classDefinition === 'undefined' || isString(classDefinition)) {
    return function decorator(target: any): any {
      register(target, <string>classDefinition)
    }
  }

  const item: ClassRegistryItem = new ClassRegistryItem(
    className || get_class_name(classDefinition, false),
    classDefinition,
    undefined,
    undefined,
    overridable,
    singleton
  )
  ClassRegistry.register(item)
}
