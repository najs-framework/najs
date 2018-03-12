/// <reference types="express" />
import { ExpressMiddlewareBase } from './ExpressMiddlewareBase';
import * as Express from 'express';
export declare let RequestIdGenerator: Express.Handler;
export declare class RequestIdMiddleware extends ExpressMiddlewareBase {
    static className: string;
    protected parseIdentify(...args: string[]): string;
    protected parseLevel(level: string): boolean;
    createMiddleware(): Express.Handler | Express.Handler[] | undefined;
}
