import { IDispatcher } from './IDispatcher';
export declare abstract class EventSubscriber {
    abstract subscribe(eventDispatcher: IDispatcher): void;
}
