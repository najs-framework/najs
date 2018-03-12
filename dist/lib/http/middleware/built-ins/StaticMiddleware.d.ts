/// <reference types="express" />
import { ExpressHttpDriver } from './../../driver/ExpressHttpDriver';
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase';
import { IAutoload } from 'najs-binding';
import * as Express from 'express';
export declare class StaticMiddleware extends ExpressMiddlewareBase implements IAutoload {
    static className: string;
    protected publicPath: string;
    protected directory: string;
    getClassName(): string;
    protected parseParams(name: string, directory?: string, publicPath?: string): void;
    createMiddleware(): Express.Handler | Express.Handler[] | undefined;
    native(driver: ExpressHttpDriver): Express.Handler | Express.Handler[] | undefined;
}
