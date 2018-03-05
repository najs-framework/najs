/// <reference types="express" />
import { IExpressMiddleware } from './IExpressMiddleware';
import { ExpressController } from '../controller/ExpressController';
import * as Express from 'express';
export declare let CookieParser: Express.RequestHandler;
export declare class CookieMiddleware implements IExpressMiddleware {
    static className: string;
    constructor();
    protected getSecret(): string;
    protected getOptions(): Object;
    before(request: Express.Request, response: Express.Response): Promise<{}>;
    after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>;
}
