import { IAutoload } from 'najs-binding';
import { ContextualFacade } from 'najs-facade';
import { Controller } from '../controller/Controller';
import { FlashRegistry, ISession } from './ISession';
export interface Session extends ISession {
}
export declare class Session extends ContextualFacade<Controller> implements ISession, IAutoload {
    static FlashRegistryKey: string;
    protected data: Object;
    constructor(controller: Controller);
    getClassName(): string;
    clear(): this;
    regenerate(): Promise<void>;
    getFlashRegistry(): FlashRegistry;
    flash(path: string, value: any): this;
    reflash(): this;
    keep(path: string): this;
    keep(paths: string[]): this;
    keep(...args: Array<string | string[]>): this;
    isFlashPath(path: string): boolean;
    get<T extends any>(path: string): T;
    get<T extends any>(path: string, defaultValue: T): T;
}
