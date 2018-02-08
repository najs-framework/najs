import { make } from './make'
import { IHttpDriver } from '../http/driver/IHttpDriver'
import { AppOptions, IApplication } from './IApplication'
import { ServiceProvider } from './ServiceProvider'
import { HttpDriverClass } from '../constants'

export interface INajs {
  rootPath: string

  app: IApplication

  cwd(cwd: string): this

  providers(providers: ServiceProvider[]): this

  start(): void
  start(options: Partial<AppOptions>): void
}

export const Najs: INajs = {
  rootPath: '',
  app: <any>undefined,

  cwd(cwd: string): INajs {
    this.rootPath = cwd
    return this
  },

  providers(providers: ServiceProvider[]): INajs {
    return this
  },

  start(arg?: Partial<AppOptions>): void {
    const httpDriver: IHttpDriver = make<IHttpDriver>(HttpDriverClass)
    httpDriver.start({})
  }
}

Najs.cwd(__dirname)
  .providers([])
  .start()

const Test = <any>{}

Test.workingDirectory(__dirname)
  .classes(require('autoload.ts'))
  .providers([
    'CacheProvider',
    'RedisProvider',
    'MongooseProvider',
    'ValidationProvider',
    'LoggerProvider',
    'HttpDriverProvider'
  ])
  .on('booting', function() {})
  .on('booted', function() {})
  .on('crashed', function() {})
  .start()
