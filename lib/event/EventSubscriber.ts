import { IAutoload } from '../core/IAutoload'
import { IDispatcher } from './IDispatcher'

export abstract class EventSubscriber implements IAutoload {
  abstract getClassName(): string
  abstract subscribe(eventDispatcher: IDispatcher): void
}
