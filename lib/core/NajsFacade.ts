import { make } from './make'
import { register } from './register'
import { bind, InstanceCreator } from './bind'
import { IHttpDriver } from '../http/driver/IHttpDriver'
import { ConfigurationKeys, HttpDriverClass } from '../constants'
import { IConfig } from 'config'
import { isFunction, pickBy } from 'lodash'
import { NajsOptions, NajsPath, INajsFacade } from './INajsFacade'
import * as Path from 'path'
import * as Config from 'config'

const NajsDefaultOptions: NajsOptions = {
  port: 3000
}

class Najs implements INajsFacade {
  private config: IConfig = Config
  private options: NajsOptions = NajsDefaultOptions

  private assert_config_is_registered_before_using() {
    if (!this.config) {
      throw new ReferenceError('Please register config instance firstly: Najs.use(require("config"))')
    }
  }

  use(config: IConfig): this
  use(options: Partial<NajsOptions>): this
  use(configOrOptions: IConfig | Partial<NajsOptions>): this {
    if (isFunction(configOrOptions['get']) && isFunction(configOrOptions['has'])) {
      this.config = configOrOptions as IConfig
      const optionsInConfig = Object.keys(ConfigurationKeys.NajsOptions).reduce((memo, key) => {
        memo[key] = this.getConfig(ConfigurationKeys.NajsOptions[key], false)
        return memo
      }, {})
      this.options = Object.assign({}, NajsDefaultOptions, pickBy(optionsInConfig))
    } else {
      this.options = Object.assign({}, NajsDefaultOptions, configOrOptions as Partial<NajsOptions>)
    }
    return this
  }

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

  hasConfig(setting: string): boolean {
    this.assert_config_is_registered_before_using()
    return this.config.has(setting)
  }

  getConfig<T>(setting: string): T
  getConfig<T>(setting: string, defaultValue: T): T
  getConfig<T>(setting: string, defaultValue?: T): T {
    this.assert_config_is_registered_before_using()
    if (typeof defaultValue === 'undefined') {
      return this.config.get<T>(setting)
    }
    if (this.hasConfig(setting)) {
      return this.config.get<T>(setting)
    }
    return defaultValue
  }

  // loadClasses(classes: Array<any>): this
  // loadClasses(classes: Object): this
  // loadClasses(classes: Object | Array<any>): this {
  //   return this
  // }

  path(): string
  path(...args: string[]): string
  path(type: NajsPath, ...args: string[]): string
  path(...args: any[]): string {
    // given that najs installed in node_modules so the path to this file is
    //   ~/node_modules/najs/dist/lib/core/NajsFacade.js
    const cwd = this.getConfig(ConfigurationKeys.CWD, Path.join(__dirname, '..', '..', '..', '..'))
    if (arguments.length === 0) {
      return cwd
    }
    const [firstPath, ...paths] = args
    let based: string = ''
    switch (firstPath) {
      case NajsPath.App:
        based = Path.join(cwd, this.getConfig(ConfigurationKeys.Paths.app, 'app'))
        break
      case NajsPath.Config:
        based = Path.join(cwd, this.getConfig(ConfigurationKeys.Paths.config, 'config'))
        break
      case NajsPath.Layout:
        based = Path.join(cwd, this.getConfig(ConfigurationKeys.Paths.layout, Path.join('resources', 'view', 'layout')))
        break
      case NajsPath.Public:
        based = Path.join(cwd, this.getConfig(ConfigurationKeys.Paths.public, 'public'))
        break
      case NajsPath.Resource:
        based = Path.join(cwd, this.getConfig(ConfigurationKeys.Paths.resource, 'resources'))
        break
      case NajsPath.Route:
        based = Path.join(cwd, this.getConfig(ConfigurationKeys.Paths.route, 'routes'))
        break
      case NajsPath.Storage:
        based = Path.join(cwd, this.getConfig(ConfigurationKeys.Paths.storage, Path.join('app', 'storage')))
        break
      case NajsPath.View:
        based = Path.join(cwd, this.getConfig(ConfigurationKeys.Paths.view, Path.join('resources', 'view')))
        break
      default:
        based = Path.join(cwd, firstPath)
        break
    }
    return Path.join(based, ...paths)
  }

  start(): void
  start(options: Partial<NajsOptions>): void
  start(config: IConfig): void
  start(arg?: IConfig | Partial<NajsOptions>): void {
    if (arg) {
      this.use(<any>arg)
    }
    const httpDriver: IHttpDriver = make<IHttpDriver>(HttpDriverClass)
    httpDriver.start(this.options)
  }
}

export const NajsFacade: INajsFacade = new Najs()
