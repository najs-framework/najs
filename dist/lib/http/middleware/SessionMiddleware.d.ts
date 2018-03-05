/// <reference types="express" />
import '../session/ExpressSessionMemoryStore';
import { IExpressMiddleware } from './IExpressMiddleware';
import { ExpressController } from '../controller/ExpressController';
import * as Express from 'express';
export declare let Session: Express.RequestHandler;
export declare class SessionMiddleware implements IExpressMiddleware {
    static className: string;
    constructor();
    protected makeStore(): any;
    protected getOptions(): any;
    before(request: Express.Request, response: Express.Response): Promise<{}>;
    after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>;
}
