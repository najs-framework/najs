import { make } from './make'
import { register } from './register'
import { bind, InstanceCreator } from './bind'
import { IHttpDriver } from '../http/driver/IHttpDriver'
import { IConfig } from '../config/IConfig'
import { ConfigurationKeys, HttpDriverClass } from '../constants'
import { AppOptions, AppPath, IApplication } from './IApplication'
import * as Path from 'path'

const DefaultOptions: AppOptions = {
  port: 3000
}

export class Application implements IApplication {
  public config: IConfig
  private options: AppOptions = DefaultOptions

  use(options: Partial<AppOptions>): this
  use(configOrOptions: Partial<AppOptions>): this {
    this.options = Object.assign({}, DefaultOptions, configOrOptions as Partial<AppOptions>)
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

  path(): string
  path(...args: string[]): string
  path(type: AppPath, ...args: string[]): string
  path(...args: any[]): string {
    // given that najs installed in node_modules so the path to this file is
    //   ~/node_modules/najs/dist/lib/core/NajsFacade.js
    const cwd = this.config.get(ConfigurationKeys.CWD, Path.join(__dirname, '..', '..', '..', '..'))
    if (arguments.length === 0) {
      return cwd
    }
    const [firstPath, ...paths] = args
    let based: string = ''
    switch (firstPath) {
      case AppPath.App:
        based = Path.join(cwd, this.config.get(ConfigurationKeys.Paths.app, 'app'))
        break
      case AppPath.Base:
        based = Path.join(cwd, this.config.get(ConfigurationKeys.Paths.base, ''))
        break
      case AppPath.Config:
        based = Path.join(cwd, this.config.get(ConfigurationKeys.Paths.config, 'config'))
        break
      case AppPath.Layout:
        based = Path.join(
          cwd,
          this.config.get(ConfigurationKeys.Paths.layout, Path.join('resources', 'view', 'layout'))
        )
        break
      case AppPath.Public:
        based = Path.join(cwd, this.config.get(ConfigurationKeys.Paths.public, 'public'))
        break
      case AppPath.Resource:
        based = Path.join(cwd, this.config.get(ConfigurationKeys.Paths.resource, 'resources'))
        break
      case AppPath.Route:
        based = Path.join(cwd, this.config.get(ConfigurationKeys.Paths.route, 'routes'))
        break
      case AppPath.Storage:
        based = Path.join(cwd, this.config.get(ConfigurationKeys.Paths.storage, Path.join('app', 'storage')))
        break
      case AppPath.View:
        based = Path.join(cwd, this.config.get(ConfigurationKeys.Paths.view, Path.join('resources', 'view')))
        break
      default:
        based = Path.join(cwd, firstPath)
        break
    }
    return Path.join(based, ...paths)
  }

  start(): void
  start(options: Partial<AppOptions>): void
  start(arg?: IConfig | Partial<AppOptions>): void {
    if (arg) {
      this.use(<any>arg)
    }
    const httpDriver: IHttpDriver = make<IHttpDriver>(HttpDriverClass)
    httpDriver.start(this.options)
  }
}
