/// <reference types="express" />
import { IAutoload } from 'najs-binding';
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase';
import * as Express from 'express';
export declare let CorsEnable: Express.RequestHandler;
export declare class CorsMiddleware extends ExpressMiddlewareBase implements IAutoload {
    static className: string;
    getOptions(): {};
    getClassName(): string;
    createMiddleware(): Express.Handler | Express.Handler[] | undefined;
}
