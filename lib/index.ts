import { make } from './core/make'
import { register } from './core/register'

export * from './core/make'
export * from './core/register'
export * from './core/autoload'
export * from './core/ClassRegistry'

export default class Najs {
  static make<T>(classDefinition: any): T
  static make<T>(className: string): T
  static make<T>(className: string, data: Object): T
  static make(className: string): any {
    return make(className)
  }

  static register<T>(classDefinition: T): void
  static register<T>(classDefinition: T, className: string): void
  static register<T>(classDefinition: T, className: string, overridable: boolean): void
  static register(classDefinition: any, className?: any, overridable?: any): void {
    return register(classDefinition, className, overridable)
  }
}

export * from './types/IAutoload'
