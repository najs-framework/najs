/// <reference path="../contracts/HttpDriver.ts" />
/// <reference path="../contracts/types/http.ts" />

import { INajs } from './INajs'
import { EventEmitter } from 'events'
import { ServiceProvider } from './ServiceProvider'
import { Application } from './Application'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../constants'
import { FacadeContainer } from 'najs-facade'
import * as SystemPath from 'path'

class NajsFramework extends FacadeContainer implements INajs {
  private internalEventEmitter: EventEmitter
  protected cwd: string
  protected serviceProviders: ServiceProvider[]
  protected app: Application
  protected httpDriver: Najs.Contracts.HttpDriver<any, any>

  constructor() {
    super()
    this.cwd = SystemPath.resolve(__dirname, '..', '..', '..', '..')
    this.internalEventEmitter = new EventEmitter()
    this.serviceProviders = []
    this.app = new Application()
  }

  workingDirectory(cwd: string): this {
    this.cwd = cwd
    return this
  }

  classes(...args: string[]): this {
    for (const path of args) {
      require(SystemPath.resolve(this.cwd, path))
    }
    return this
  }

  providers(providers: any[]): this {
    for (const name of providers) {
      const provider = this.resolveProvider(name)
      if (!provider) {
        continue
      }
      this.serviceProviders.push(provider)
    }
    return this
  }

  on(event: string, listener: any): this {
    this.internalEventEmitter.on(event, listener)
    return this
  }

  async start(): Promise<void>
  async start(options: Najs.Http.StartOptions): Promise<void>
  async start(options?: Najs.Http.StartOptions): Promise<void> {
    try {
      this.fireEventIfNeeded('start', this)
      await this.applyServiceProviders(true, 'registered')
      await this.applyServiceProviders(false, 'booted')
      this.httpDriver = this.app.make<Najs.Contracts.HttpDriver<any, any>>(NajsClasses.Http.HttpDriver)
      this.httpDriver.start(options)
      this.fireEventIfNeeded('started', this)
    } catch (error) {
      this.handleError(error)
    }
  }

  protected handleError(error: any) {
    if (this.fireEventIfNeeded('crash', error)) {
      return
    }

    if (this.fireEventIfNeeded('crashed', error)) {
      return
    }

    throw error
  }

  private async applyServiceProviders(register: boolean, event: string) {
    for (const provider of this.serviceProviders) {
      await (register ? provider.register() : provider.boot())
      this.fireEventIfNeeded(event, this, provider)
    }
  }

  protected resolveProvider(provider: string | typeof ServiceProvider): ServiceProvider | undefined {
    if (typeof provider === 'string') {
      return make<ServiceProvider>(provider, [this.app])
    }
    return Reflect.construct(provider, [this.app])
  }

  protected fireEventIfNeeded(event: string, ...args: any[]): boolean {
    if (EventEmitter.listenerCount(this.internalEventEmitter, event) > 0) {
      this.internalEventEmitter.emit(event, ...args)
      return true
    }
    return false
  }
}

export const Najs: INajs = new NajsFramework()
