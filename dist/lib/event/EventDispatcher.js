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
}
EventDispatcher.className = constants_1.GlobalFacadeClass.Event;
exports.EventDispatcher = EventDispatcher;
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
};
for (const functionName in EVENT_EMITTER_FUNCTIONS) {
    EventDispatcher.prototype[functionName] = function () {
        const result = this['eventEmitter'][functionName](...arguments);
        if (EVENT_EMITTER_FUNCTIONS[functionName]) {
            return this;
        }
        return result;
    };
}
najs_binding_1.register(EventDispatcher, constants_1.GlobalFacadeClass.Event);
