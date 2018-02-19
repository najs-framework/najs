import { InstanceCreator } from './bind'

export interface IApplication {
  make<T>(classDefinition: any): T
  make<T>(className: string): T

  makeWith<T>(classDefinition: any, data: Object): T
  makeWith<T>(className: string, data: Object): T
  makeWith<T>(classDefinition: string, data: any[]): T
  makeWith<T>(className: string, data: any[]): T

  register<T>(classDefinition: T): IApplication
  register<T>(classDefinition: T, className: string): IApplication
  register<T>(classDefinition: T, className: string, overridable: boolean): IApplication
  register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): IApplication

  bind(className: string, instanceCreator: InstanceCreator): IApplication
  bind(className: string, concrete: string): IApplication
}
