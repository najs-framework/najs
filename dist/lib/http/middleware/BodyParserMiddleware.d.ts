/// <reference types="express" />
import { IExpressMiddleware } from './IExpressMiddleware';
import * as Express from 'express';
export declare let JsonParser: Express.RequestHandler;
export declare let UrlEncodedParser: Express.RequestHandler;
export declare class BodyParserMiddleware implements IExpressMiddleware {
    static className: string;
    constructor();
    protected getUrlEncodedOptions(): {
        extended: boolean;
    };
    before(request: Express.Request, response: Express.Response): Promise<{}>;
}
