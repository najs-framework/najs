/// <reference types="express" />
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase';
import { IAutoload } from 'najs-binding';
import * as Express from 'express';
export declare let RequestIdGenerator: Express.Handler;
export declare class RequestIdMiddleware extends ExpressMiddlewareBase implements IAutoload {
    static className: string;
    getClassName(): string;
    protected parseIdentify(...args: string[]): string;
    protected parseLevel(level: string): boolean;
    createMiddleware(): Express.Handler | Express.Handler[] | undefined;
}
