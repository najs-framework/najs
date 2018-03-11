/// <reference types="express" />
import { ExpressMiddlewareBase } from './ExpressMiddlewareBase';
import { ExpressController } from '../controller/ExpressController';
import { Controller } from '../../http/controller/Controller';
import * as Express from 'express';
export declare let CookieParser: Express.RequestHandler;
export declare class CookieMiddleware extends ExpressMiddlewareBase {
    static className: string;
    protected parseIdentify(...args: string[]): string;
    createMiddleware(): Express.Handler | Express.Handler[] | undefined;
    protected getSecret(): string;
    protected getOptions(): Object;
    before(request: Express.Request, response: Express.Response, controller: Controller): Promise<void>;
    after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>;
}
