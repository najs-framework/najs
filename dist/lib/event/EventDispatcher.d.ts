/// <reference types="node" />
import { IAutoload } from 'najs-binding';
import { Facade } from '../facades/Facade';
import { IDispatcher } from './IDispatcher';
import { EventEmitter } from 'events';
import { EventSubscriber } from './EventSubscriber';
import { IEventEmitter } from './IEventEmitter';
export declare class EventDispatcher extends Facade implements IDispatcher, IAutoload, IEventEmitter {
    static className: string;
    protected eventEmitter: EventEmitter;
    constructor();
    getClassName(): string;
    listen(name: string, listener: string): this;
    listen(name: string, listener: (...args: any[]) => void): this;
    hasListeners(name: string): boolean;
    fire(name: string, ...args: any[]): this;
    forget(name: string): this;
    subscribe(eventSubscriber: string): this;
    subscribe(eventSubscriber: typeof EventSubscriber): this;
    resolveSubscriber(eventSubscriber: string | typeof EventSubscriber): EventSubscriber | undefined;
    resolveListener(listener: string | ((...args: any[]) => void)): ((...args: any[]) => void) | undefined;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(event: string | symbol): Function[];
    emit(event: string | symbol, ...args: any[]): boolean;
    eventNames(): Array<string | symbol>;
    listenerCount(type: string | symbol): number;
}
