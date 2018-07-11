/// <reference types="express" />
import '../../session/ExpressSessionMemoryStore';
import { IAutoload } from 'najs-binding';
import { ExpressController } from '../../controller/ExpressController';
import { Controller } from '../../controller/Controller';
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase';
import * as Express from 'express';
export declare let Session: Express.RequestHandler;
export declare class SessionMiddleware extends ExpressMiddlewareBase implements IAutoload {
    static className: string;
    getClassName(): string;
    createMiddleware(): Express.Handler | Express.Handler[] | undefined;
    protected makeStore(): any;
    protected getOptions(): any;
    before(request: Express.Request, response: Express.Response, controller: Controller): Promise<void>;
    after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>;
}
