/// <reference types="express" />
import { IAutoload } from 'najs-binding';
import { IExpressMiddleware } from './IExpressMiddleware';
import * as Express from 'express';
export declare let CorsEnable: Express.RequestHandler;
export declare class ExpressCorsMiddleware implements IExpressMiddleware, IAutoload {
    static className: string;
    constructor();
    getOptions(): {};
    getClassName(): string;
    before(request: Express.Request, response: Express.Response): Promise<{}>;
}
