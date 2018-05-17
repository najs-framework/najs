/// <reference types="node" />
/// <reference path="../contracts/Dispatcher.ts" />

import { register, make } from 'najs-binding'
import { Facade } from 'najs-facade'
import { EventEmitter } from 'events'
import { EventSubscriber } from './EventSubscriber'
import { Najs } from '../constants'

export interface EventDispatcher extends NodeJS.EventEmitter {}
export class EventDispatcher extends Facade implements Najs.Contracts.Dispatcher {
  static className: string = Najs.Event.EventDispatcher
  protected eventEmitter: EventEmitter

  constructor() {
    super()
    this.eventEmitter = new EventEmitter()
  }

  getClassName() {
    return Najs.Event.EventDispatcher
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
}

const EVENT_EMITTER_FUNCTIONS = {
  addListener: true,
  on: true,
  once: true,
  prependListener: true,
  prependOnceListener: true,
  removeListener: true,
  removeAllListeners: true,
  setMaxListeners: true,
  getMaxListeners: false,
  listeners: false,
  emit: false,
  eventNames: false,
  listenerCount: false
}
for (const functionName in EVENT_EMITTER_FUNCTIONS) {
  EventDispatcher.prototype[functionName] = function() {
    const result = this['eventEmitter'][functionName](...arguments)
    if (EVENT_EMITTER_FUNCTIONS[functionName]) {
      return this
    }
    return result
  }
}

register(EventDispatcher, Najs.Event.EventDispatcher)
