/// <reference path="../contracts/Application.d.ts" />
import { IAutoload } from 'najs-binding';
export declare abstract class ServiceProvider implements IAutoload {
    abstract getClassName(): string;
    protected app: Najs.Contracts.Application;
    constructor(app: Najs.Contracts.Application);
    register(): Promise<void>;
    boot(): Promise<void>;
}
