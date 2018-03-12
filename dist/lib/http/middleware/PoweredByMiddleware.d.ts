/// <reference types="express" />
import { ExpressMiddlewareBase } from './ExpressMiddlewareBase';
import * as Express from 'express';
export declare let PoweredBySetter: Express.Handler;
export declare class PoweredByMiddleware extends ExpressMiddlewareBase {
    static className: string;
    protected poweredBy: string;
    protected parseIdentify(...args: string[]): string;
    protected parseLevel(level: string): boolean;
    protected parseParams(...args: string[]): string;
    createMiddleware(): Express.Handler | Express.Handler[] | undefined;
}
