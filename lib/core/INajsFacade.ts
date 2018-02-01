import { IConfig } from 'config'
import { InstanceCreator } from './bind'

export type NajsOptions = {
  port: number
  host?: string
}

export interface INajsFacade {
  use(config: IConfig): INajsFacade
  use(options: Partial<NajsOptions>): INajsFacade

  make<T>(classDefinition: any): T
  make<T>(className: string): T
  make<T>(className: string, data: Object): T

  register<T>(classDefinition: T): INajsFacade
  register<T>(classDefinition: T, className: string): INajsFacade
  register<T>(classDefinition: T, className: string, overridable: boolean): INajsFacade
  register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): INajsFacade

  bind(className: string, instanceCreator: InstanceCreator): INajsFacade
  bind(className: string, concrete: string): INajsFacade

  hasConfig(setting: string): boolean

  getConfig<T>(setting: string): T
  getConfig<T>(setting: string, defaultValue: T): T

  start(): void
  start(options: Partial<NajsOptions>): void
  start(config: IConfig): void
}
