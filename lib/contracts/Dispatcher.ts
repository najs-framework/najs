/// <reference path="EventSubscriber.ts" />
/// <reference types="node" />

namespace Najs.Contracts {
  export interface Dispatcher extends Autoload, NodeJS.EventEmitter {
    /**
     * Register an event with the listener.
     *
     * @param {string} name event name
     * @param {string} listener listener with syntax "ClassName@functionName"
     */
    listen(name: string, listener: string): this
    /**
     * Register an event with the listener.
     *
     * @param {string} name event name
     * @param {Function} listener listener callback
     */
    listen(name: string, listener: (...args: any[]) => void): this

    /**
     * Determine if a given event has listeners.
     * @param {string} name event name
     */
    hasListeners(name: string): boolean

    /**
     * Fire an event and call the listeners.
     *
     * @param {string} name event name
     * @param {mixed} args arguments
     */
    fire(name: string, ...args: any[]): this

    /**
     * Remove a set of listeners by event name.
     *
     * @param {string} name event name
     */
    forget(name: string): this

    /**
     * Register an event subscriber.
     * @param {string} eventSubscriber
     */
    subscribe(eventSubscriber: string): this
    /**
     * Register an event subscriber.
     * @param {Function} eventSubscriber
     */
    subscribe(eventSubscriber: { new (): EventSubscriber }): this
  }
}
