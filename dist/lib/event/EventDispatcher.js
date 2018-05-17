"use strict";
/// <reference types="node" />
/// <reference path="../contracts/Dispatcher.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const events_1 = require("events");
const constants_1 = require("../constants");
class EventDispatcher extends najs_facade_1.Facade {
    constructor() {
        super();
        this.eventEmitter = new events_1.EventEmitter();
    }
    getClassName() {
        return constants_1.GlobalFacadeClass.Event;
    }
    listen(name, arg) {
        const listener = this.resolveListener(arg);
        if (listener) {
            this.eventEmitter.on(name, listener);
        }
        return this;
    }
    hasListeners(name) {
        return this.eventEmitter.listenerCount(name) !== 0;
    }
    fire(name, ...args) {
        this.eventEmitter.emit(name, ...args);
        return this;
    }
    forget(name) {
        this.eventEmitter.removeAllListeners(name);
        return this;
    }
    subscribe(eventSubscriber) {
        const subscriber = this.resolveSubscriber(eventSubscriber);
        if (subscriber) {
            subscriber.subscribe(this);
        }
        return this;
    }
    resolveSubscriber(eventSubscriber) {
        if (typeof eventSubscriber === 'string') {
            return najs_binding_1.make(eventSubscriber);
        }
        return Reflect.construct(eventSubscriber, []);
    }
    resolveListener(listener) {
        if (typeof listener === 'string') {
            const parts = listener.split('@');
            if (parts.length === 2) {
                const instance = najs_binding_1.make(parts[0]);
                if (instance && typeof instance[parts[1]] === 'function') {
                    return instance[parts[1]];
                }
            }
            return undefined;
        }
        return listener;
    }
    // -------------------------------------------------------------------------------------------------------------------
    addListener(event, listener) {
        this.eventEmitter.addListener(event, listener);
        return this;
    }
    on(event, listener) {
        this.eventEmitter.on(event, listener);
        return this;
    }
    once(event, listener) {
        this.eventEmitter.once(event, listener);
        return this;
    }
    prependListener(event, listener) {
        this.eventEmitter.prependListener(event, listener);
        return this;
    }
    prependOnceListener(event, listener) {
        this.eventEmitter.prependOnceListener(event, listener);
        return this;
    }
    removeListener(event, listener) {
        this.eventEmitter.removeListener(event, listener);
        return this;
    }
    removeAllListeners(event) {
        this.eventEmitter.removeAllListeners(event);
        return this;
    }
    setMaxListeners(n) {
        this.eventEmitter.setMaxListeners(n);
        return this;
    }
    getMaxListeners() {
        return this.eventEmitter.getMaxListeners();
    }
    listeners(event) {
        return this.eventEmitter.listeners(event);
    }
    emit(event, ...args) {
        return this.eventEmitter.emit(event, ...args);
    }
    eventNames() {
        return this.eventEmitter.eventNames();
    }
    listenerCount(type) {
        return this.eventEmitter.listenerCount(type);
    }
}
EventDispatcher.className = constants_1.GlobalFacadeClass.Event;
exports.EventDispatcher = EventDispatcher;
najs_binding_1.register(EventDispatcher, constants_1.GlobalFacadeClass.Event);
