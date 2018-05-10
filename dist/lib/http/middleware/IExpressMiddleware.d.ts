/// <reference path="../../contracts/types/http.d.ts" />
/// <reference types="express" />
import { ExpressHttpDriver } from '../driver/ExpressHttpDriver';
import { ExpressController } from '../controller/ExpressController';
import * as Express from 'express';
export interface IExpressMiddleware extends Najs.Http.IMiddleware {
    native?(driver: ExpressHttpDriver): Express.Handler | Express.Handler[] | undefined;
    before?(request: Express.Request, response: Express.Response, controller: ExpressController): Promise<any>;
    after?(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>;
}
