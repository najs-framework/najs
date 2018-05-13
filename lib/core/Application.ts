/// <reference path="../contracts/Application.ts" />

import { make, register, bind, IAutoload, extend, InstanceCreator, InstanceExtending } from 'najs-binding'
import { Facade } from 'najs-facade'
import { Najs } from '../constants'

export class Application extends Facade implements Najs.Contracts.Application, IAutoload {
  static className: string = Najs.Application
  getClassName(): string {
    return Najs.Application
  }

  make(className: any): any {
    return make(className)
  }

  makeWith<T>(className: any, data: any): T {
    return make(className, data)
  }

  register(classDefinition: any, className?: any, overridable?: any, singleton?: any): this {
    register(classDefinition, className, overridable, singleton)
    return this
  }

  bind(abstract: string, concrete: string | InstanceCreator): this {
    bind(abstract, <any>concrete)
    return this
  }

  extend(abstract: any, decorator: InstanceExtending): Najs.Contracts.Application {
    extend(abstract, decorator)
    return this
  }
}
register(Application, Najs.Application)
