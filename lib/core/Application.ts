import { make } from './make'
import { register } from './register'
import { bind, InstanceCreator } from './bind'
import { IApplication } from './IApplication'
import { Facade } from '../facades/Facade'

export class Application extends Facade implements IApplication {
  make<T>(classDefinition: any): T
  make<T>(className: string): T
  make<T>(className: string, data: Object): T
  make(className: any, data?: any): any {
    return make(className, data)
  }

  register<T>(classDefinition: T): this
  register<T>(classDefinition: T, className: string): this
  register<T>(classDefinition: T, className: string, overridable: boolean): this
  register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): this
  register(classDefinition: any, className?: any, overridable?: any, singleton?: any): this {
    register(classDefinition, className, overridable, singleton)
    return this
  }

  bind(className: string, instanceCreator: InstanceCreator): this
  bind(className: string, concrete: string): this
  bind(abstract: string, concrete: string | InstanceCreator): this {
    bind(abstract, <any>concrete)
    return this
  }
}
