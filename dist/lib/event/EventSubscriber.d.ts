/// <reference path="../contracts/EventSubscriber.d.ts" />
export declare abstract class EventSubscriber implements Najs.Contracts.EventSubscriber {
    abstract getClassName(): string;
    abstract subscribe(eventDispatcher: Najs.Contracts.Dispatcher): void;
}
