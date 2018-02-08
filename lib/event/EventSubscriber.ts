import { IDispatcher } from './IDispatcher'

export abstract class EventSubscriber {
  abstract subscribe(eventDispatcher: IDispatcher): void
}
