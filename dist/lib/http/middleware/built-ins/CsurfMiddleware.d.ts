/// <reference types="express" />
import { IAutoload } from 'najs-binding';
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase';
import * as Express from 'express';
export declare let CsurfProtection: Express.RequestHandler;
export declare class CsurfMiddleware extends ExpressMiddlewareBase implements IAutoload {
    static className: string;
    getOptions(): {
        cookie: boolean;
    };
    getClassName(): string;
    createMiddleware(): Express.Handler | Express.Handler[] | undefined;
    after(request: Express.Request, response: Express.Response, result: any): Promise<any>;
}
