/// <reference path="../contracts/EventSubscriber.ts" />

export abstract class EventSubscriber implements Najs.Contracts.EventSubscriber {
  abstract getClassName(): string
  abstract subscribe(eventDispatcher: Najs.Contracts.Dispatcher): void
}
