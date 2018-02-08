"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Dispatcher extends events_1.EventEmitter {
    listen(name, arg) {
        const listener = this.resolveListener(arg);
        if (!listener) {
            return this;
        }
        return this.on(name, listener);
    }
    hasListeners(name) {
        return this.listenerCount(name) !== 0;
    }
    fire(name, ...args) {
        this.emit(name, ...args);
        return this;
    }
    forget(name) {
        return this.removeAllListeners(name);
    }
    subscribe(eventSubscriber) {
        const subscriber = this.resolveSubscriber(eventSubscriber);
        if (subscriber) {
            subscriber.subscribe(this);
        }
        return this;
    }
    resolveSubscriber(eventSubscriber) {
        return undefined;
    }
    resolveListener(listener) {
        if (typeof listener === 'string') {
            return undefined;
        }
        return listener;
    }
}
exports.Dispatcher = Dispatcher;
