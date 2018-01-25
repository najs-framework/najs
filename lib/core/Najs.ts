import { make } from './make'
import { register } from './register'
import { bind, InstanceCreator } from './bind'
import { IHttpDriver } from '../http/driver/IHttpDriver'
import { Configuration, HttpDriverClass } from '../constants'
import { IConfig } from 'config'
import { isFunction, pickBy } from 'lodash'

export type NajsOptions = {
  port: number
  host?: string
}

const NajsDefaultOptions: NajsOptions = {
  port: 3000
}

function assert_config_is_registered_before_using() {
  if (!Najs['config']) {
    throw new ReferenceError('Please register config instance firstly: Najs.use(require("config"))')
  }
}

export class Najs {
  private static config: IConfig
  private static options: NajsOptions = NajsDefaultOptions

  static use(config: IConfig): typeof Najs
  static use(options: Partial<NajsOptions>): typeof Najs
  static use(configOrOptions: IConfig | Partial<NajsOptions>): typeof Najs {
    if (isFunction(configOrOptions['get']) && isFunction(configOrOptions['has'])) {
      this.config = configOrOptions as IConfig
      const optionsInConfig = Object.keys(Configuration.NajsOptions).reduce((memo, key) => {
        memo[key] = this.getConfig(Configuration.NajsOptions[key], false)
        return memo
      }, {})
      this.options = Object.assign({}, NajsDefaultOptions, pickBy(optionsInConfig))
    } else {
      this.options = Object.assign({}, NajsDefaultOptions, configOrOptions as Partial<NajsOptions>)
    }
    return Najs
  }

  static make<T>(classDefinition: any): T
  static make<T>(className: string): T
  static make<T>(className: string, data: Object): T
  static make(className: any, data?: any): any {
    return make(className, data)
  }

  static register<T>(classDefinition: T): typeof Najs
  static register<T>(classDefinition: T, className: string): typeof Najs
  static register<T>(classDefinition: T, className: string, overridable: boolean): typeof Najs
  static register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): typeof Najs
  static register(classDefinition: any, className?: any, overridable?: any, singleton?: any): typeof Najs {
    register(classDefinition, className, overridable, singleton)
    return this
  }

  static bind(className: string, instanceCreator: InstanceCreator): typeof Najs
  static bind(className: string, concrete: string): typeof Najs
  static bind(abstract: string, concrete: string | InstanceCreator): typeof Najs {
    bind(abstract, <any>concrete)
    return this
  }

  static hasConfig(setting: string): boolean {
    assert_config_is_registered_before_using()
    return this.config.has(setting)
  }

  static getConfig<T>(setting: string): T
  static getConfig<T>(setting: string, defaultValue: T): T
  static getConfig<T>(setting: string, defaultValue?: T): T {
    assert_config_is_registered_before_using()
    if (typeof defaultValue === 'undefined') {
      return this.config.get<T>(setting)
    }
    if (this.hasConfig(setting)) {
      return this.config.get<T>(setting)
    }
    return defaultValue
  }

  // static loadClasses(classes: Array<any>): typeof Najs
  // static loadClasses(classes: Object): typeof Najs
  // static loadClasses(classes: Object | Array<any>): typeof Najs {
  //   return this
  // }

  static start(): void
  static start(options: Partial<NajsOptions>): void
  static start(config: IConfig): void
  static start(arg?: IConfig | Partial<NajsOptions>): void {
    if (arg) {
      this.use(<any>arg)
    }
    const httpDriver: IHttpDriver = make<IHttpDriver>(HttpDriverClass)
    httpDriver.start(this.options)
  }
}
