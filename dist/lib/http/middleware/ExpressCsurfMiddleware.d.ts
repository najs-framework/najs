/// <reference types="express" />
import { IAutoload } from 'najs-binding';
import { IExpressMiddleware } from './IExpressMiddleware';
import * as Express from 'express';
export declare let CsurfProtection: Express.RequestHandler;
export declare class ExpressCsurfMiddleware implements IExpressMiddleware, IAutoload {
    static className: string;
    constructor();
    getOptions(): {
        cookie: boolean;
    };
    getClassName(): string;
    before(request: Express.Request, response: Express.Response): Promise<{}>;
    after(request: Express.Request, response: Express.Response, result: any): Promise<any>;
}
