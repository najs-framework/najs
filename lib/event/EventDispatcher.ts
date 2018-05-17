/// <reference types="node" />
/// <reference path="../contracts/Dispatcher.ts" />

import { register, make } from 'najs-binding'
import { Facade } from 'najs-facade'
import { EventEmitter } from 'events'
import { EventSubscriber } from './EventSubscriber'
import { GlobalFacadeClass } from '../constants'

export interface EventDispatcher extends NodeJS.EventEmitter {}
export class EventDispatcher extends Facade implements Najs.Contracts.Dispatcher {
  static className: string = GlobalFacadeClass.Event
  protected eventEmitter: EventEmitter

  constructor() {
    super()
    this.eventEmitter = new EventEmitter()
  }

  getClassName() {
    return GlobalFacadeClass.Event
  }

  listen(name: string, listener: string): this
  listen(name: string, listener: (...args: any[]) => void): this
  listen(name: string, arg: string | ((...args: any[]) => void)): this {
    const listener = this.resolveListener(arg)
    if (listener) {
      this.eventEmitter.on(name, listener)
    }
    return this
  }

  hasListeners(name: string): boolean {
    return this.eventEmitter.listenerCount(name) !== 0
  }

  fire(name: string, ...args: any[]): this {
    this.eventEmitter.emit(name, ...args)
    return this
  }

  forget(name: string): this {
    this.eventEmitter.removeAllListeners(name)
    return this
  }

  subscribe(eventSubscriber: string): this
  subscribe(eventSubscriber: typeof EventSubscriber): this
  subscribe(eventSubscriber: string | typeof EventSubscriber): this {
    const subscriber = this.resolveSubscriber(eventSubscriber)
    if (subscriber) {
      subscriber.subscribe(this)
    }
    return this
  }

  resolveSubscriber(eventSubscriber: string | typeof EventSubscriber): EventSubscriber | undefined {
    if (typeof eventSubscriber === 'string') {
      return make<EventSubscriber>(eventSubscriber)
    }
    return Reflect.construct(eventSubscriber, [])
  }

  resolveListener(listener: string | ((...args: any[]) => void)): ((...args: any[]) => void) | undefined {
    if (typeof listener === 'string') {
      const parts: string[] = listener.split('@')
      if (parts.length === 2) {
        const instance = make(parts[0])
        if (instance && typeof instance[parts[1]] === 'function') {
          return instance[parts[1]]
        }
      }
      return undefined
    }
    return listener
  }

  // -------------------------------------------------------------------------------------------------------------------
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.eventEmitter.addListener(event, listener)
    return this
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    this.eventEmitter.on(event, listener)
    return this
  }

  once(event: string | symbol, listener: (...args: any[]) => void): this {
    this.eventEmitter.once(event, listener)
    return this
  }

  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.eventEmitter.prependListener(event, listener)
    return this
  }

  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.eventEmitter.prependOnceListener(event, listener)
    return this
  }

  removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.eventEmitter.removeListener(event, listener)
    return this
  }

  removeAllListeners(event?: string | symbol): this {
    this.eventEmitter.removeAllListeners(event)
    return this
  }

  setMaxListeners(n: number): this {
    this.eventEmitter.setMaxListeners(n)
    return this
  }

  getMaxListeners(): number {
    return this.eventEmitter.getMaxListeners()
  }

  listeners(event: string | symbol): Function[] {
    return this.eventEmitter.listeners(event)
  }

  emit(event: string | symbol, ...args: any[]): boolean {
    return this.eventEmitter.emit(event, ...args)
  }

  eventNames(): Array<string | symbol> {
    return this.eventEmitter.eventNames()
  }

  listenerCount(type: string | symbol): number {
    return this.eventEmitter.listenerCount(type)
  }
}
register(EventDispatcher, GlobalFacadeClass.Event)
