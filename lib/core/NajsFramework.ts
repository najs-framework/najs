import { INajsFramework } from './INajsFramework'
import { EventEmitter } from 'events'
import { IDispatcher } from '../event/IDispatcher'
import { IEventEmitter } from '../event/IEventEmitter'
import { IApplication } from './IApplication'
import { ServiceProvider } from './ServiceProvider'
import { make } from './make'

class NajsFramework implements INajsFramework {
  private internalEventEmitter: EventEmitter
  protected cwd: string
  protected serviceProviders: ServiceProvider[]
  protected app: IApplication
  protected event: IEventEmitter & IDispatcher
  // config: IConfig
  // response: IResponse
  // logger: ILogger
  // schemaValidator: ISchemaValidator
  // cache: ICache

  constructor() {
    this.internalEventEmitter = new EventEmitter()
    this.serviceProviders = []
  }

  workingDirectory(cwd: string): this {
    this.cwd = cwd
    return this
  }

  classes(...args: string[]): this {
    for (const path in args) {
      require(path)
    }
    return this
  }

  providers(providers: any[]): this {
    for (const name in providers) {
      const provider = this.resolveProvider(name)
      if (!provider) {
        continue
      }
      this.serviceProviders.push(provider)
    }
    return this
  }

  protected resolveProvider(provider: string | typeof ServiceProvider): ServiceProvider | undefined {
    if (typeof provider === 'string') {
      return make<ServiceProvider>(provider, [this.app])
    }
    return Reflect.construct(provider, [this.app])
  }

  on(event: string, listener: any): this {
    this.internalEventEmitter.on(event, listener)
    return this
  }

  async start() {
    try {
      this.fireEventIfNeeded('start', this)
      this.registerServiceProviders()
      await this.bootServiceProviders()
      this.fireEventIfNeeded('started', this)
    } catch (error) {
      if (this.fireEventIfNeeded('crash', error)) {
        return
      }

      if (this.fireEventIfNeeded('crashed', error)) {
        return
      }

      throw error
    }
  }

  protected async registerServiceProviders() {
    for (const provider of this.serviceProviders) {
      await provider.register()
      this.fireEventIfNeeded('registered', this, provider)
    }
  }

  protected async bootServiceProviders() {
    for (const provider of this.serviceProviders) {
      await provider.boot()
      this.fireEventIfNeeded('booted', this, provider)
    }
  }

  protected fireEventIfNeeded(event: string, ...args: any[]): boolean {
    if (EventEmitter.listenerCount(this.internalEventEmitter, event) > 0) {
      this.internalEventEmitter.emit(event, ...args)
      return true
    }
    return false
  }
}

export const Najs: INajsFramework = new NajsFramework()
