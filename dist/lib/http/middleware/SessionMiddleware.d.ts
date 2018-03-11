/// <reference types="express" />
import '../session/ExpressSessionMemoryStore';
import { ExpressController } from '../controller/ExpressController';
import { Controller } from '../../http/controller/Controller';
import { ExpressMiddlewareBase } from './ExpressMiddlewareBase';
import * as Express from 'express';
export declare let Session: Express.RequestHandler;
export declare class SessionMiddleware extends ExpressMiddlewareBase {
    static className: string;
    createMiddleware(): Express.Handler | Express.Handler[] | undefined;
    protected makeStore(): any;
    protected getOptions(): any;
    before(request: Express.Request, response: Express.Response, controller: Controller): void;
    after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>;
}
