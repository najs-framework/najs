import { IAutoload } from './IAutoload'
import { make } from './make'
import { register } from './register'
import { bind, InstanceCreator } from './bind'
import { IApplication } from './IApplication'
import { Facade } from '../facades/Facade'
import { GlobalFacadeClass } from '../constants'

export class Application extends Facade implements IApplication, IAutoload {
  static className: string = GlobalFacadeClass.Application
  getClassName(): string {
    return Application.className
  }

  make<T>(classDefinition: any): T
  make<T>(className: string): T
  make(className: any): any {
    return make(className)
  }

  makeWith<T>(classDefinition: any, data: Object): T
  makeWith<T>(className: string, data: Object): T
  makeWith<T>(classDefinition: string, data: any[]): T
  makeWith<T>(className: string, data: any[]): T
  makeWith<T>(className: any, data: any): T {
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
register(Application, GlobalFacadeClass.Application)
