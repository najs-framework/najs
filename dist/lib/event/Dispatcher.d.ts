/// <reference types="node" />
import { IDispatcher } from './IDispatcher';
import { IEventEmitter } from './IEventEmitter';
import { EventEmitter } from 'events';
import { EventSubscriber } from './EventSubscriber';
export declare class Dispatcher extends EventEmitter implements IEventEmitter, IDispatcher {
    listen(name: string, listener: string): this;
    listen(name: string, listener: (...args: any[]) => void): this;
    hasListeners(name: string): boolean;
    fire(name: string, ...args: any[]): this;
    forget(name: string): this;
    subscribe(eventSubscriber: string): this;
    subscribe(eventSubscriber: typeof EventSubscriber): this;
    resolveSubscriber(eventSubscriber: string | typeof EventSubscriber): EventSubscriber | undefined;
    resolveListener(listener: string | ((...args: any[]) => void)): ((...args: any[]) => void) | undefined;
}
