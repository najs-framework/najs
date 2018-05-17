/// <reference path="../contracts/Dispatcher.d.ts" />
/// <reference types="node" />
import { Facade } from 'najs-facade';
import { EventEmitter } from 'events';
import { EventSubscriber } from './EventSubscriber';
export interface EventDispatcher extends NodeJS.EventEmitter {
}
export declare class EventDispatcher extends Facade implements Najs.Contracts.Dispatcher {
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
}
