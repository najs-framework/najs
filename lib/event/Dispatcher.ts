import { IDispatcher } from './IDispatcher'
import { IEventEmitter } from './IEventEmitter'
import { EventEmitter } from 'events'
import { EventSubscriber } from './EventSubscriber'

export class Dispatcher extends EventEmitter implements IEventEmitter, IDispatcher {
  listen(name: string, listener: string): this
  listen(name: string, listener: (...args: any[]) => void): this
  listen(name: string, arg: string | ((...args: any[]) => void)): this {
    const listener = this.resolveListener(arg)
    if (!listener) {
      return this
    }
    return this.on(name, listener)
  }

  hasListeners(name: string): boolean {
    return this.listenerCount(name) !== 0
  }

  fire(name: string, ...args: any[]): this {
    this.emit(name, ...args)
    return this
  }

  forget(name: string): this {
    return this.removeAllListeners(name)
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
    return undefined
  }

  resolveListener(listener: string | ((...args: any[]) => void)): ((...args: any[]) => void) | undefined {
    if (typeof listener === 'string') {
      return undefined
    }
    return listener
  }
}
