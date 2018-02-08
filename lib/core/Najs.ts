import { IDispatcher } from '../event/IDispatcher'
import { IEventEmitter } from '../event/IEventEmitter'
import { IApplication } from './IApplication'
import { ServiceProvider } from './ServiceProvider'

export class NajsContainer {
  cwd: string
  app: IApplication
  event: IEventEmitter & IDispatcher
  // config: IConfig
  // response: IResponse
  // logger: ILogger
  // schemaValidator: ISchemaValidator
  // cache: ICache

  workingDirectory(cwd: string): this {
    this.cwd = cwd
    return this
  }

  classes(path: string): this {
    return this
  }

  providers(providers: ServiceProvider[]): this {
    return this
  }

  on(event: 'crash', callback: (error: Error) => void): this
  on(event: 'crashed', callback: (error: Error) => void): this
  on(event: 'registered', callback: (classProvider: ServiceProvider) => void): this
  on(event: 'booted', callback: (classProvider: ServiceProvider) => void): this
  on(event: string, callback: Function): this {
    return this
  }

  start(): this {
    return this
  }
}

export const Najs: NajsContainer = new NajsContainer()
