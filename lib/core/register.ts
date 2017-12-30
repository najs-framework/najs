import get_class_name from './internal/get_class_name'
import RegistryItem from './internal/RegistryItem'
import { ClassRegistry } from './ClassRegistry'

export function register<T>(classDefinition: T): void
export function register<T>(classDefinition: T, className: string): void
export function register<T>(classDefinition: T, className: string, overridable: boolean): void
export function register(classDefinition: any, className?: string, overridable?: boolean): void {
  const name: string = className || get_class_name(classDefinition, false)
  const symbol: symbol = Symbol.for(name)

  if (Object.getOwnPropertySymbols(ClassRegistry).indexOf(symbol) !== -1) {
    const registry: RegistryItem = ClassRegistry[symbol]
    if (!registry.overridable) {
      throw new Error('Can not overridable ' + className)
    }
  }

  ClassRegistry[symbol] = {
    name: name,
    definition: classDefinition,
    overridable: overridable === false ? false : true
  }
}
