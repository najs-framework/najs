import { IDispatcher } from '../event/IDispatcher';
import { IEventEmitter } from '../event/IEventEmitter';
import { IApplication } from './IApplication';
import { ServiceProvider } from './ServiceProvider';
export declare class NajsContainer {
    cwd: string;
    app: IApplication;
    event: IEventEmitter & IDispatcher;
    workingDirectory(cwd: string): this;
    classes(path: string): this;
    providers(providers: ServiceProvider[]): this;
    on(event: 'crash', callback: (error: Error) => void): this;
    on(event: 'crashed', callback: (error: Error) => void): this;
    on(event: 'registered', callback: (classProvider: ServiceProvider) => void): this;
    on(event: 'booted', callback: (classProvider: ServiceProvider) => void): this;
    start(): this;
}
export declare const Najs: NajsContainer;
