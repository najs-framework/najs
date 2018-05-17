/// <reference path="Dispatcher.ts" />

namespace Najs.Contracts {
  export interface EventSubscriber extends Autoload {
    subscribe(eventDispatcher: Dispatcher): void
  }
}
