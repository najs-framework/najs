/// <reference path="Dispatcher.d.ts" />
declare namespace Najs.Contracts {
    interface EventSubscriber extends Autoload {
        subscribe(eventDispatcher: Dispatcher): void;
    }
}
