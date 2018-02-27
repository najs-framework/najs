/// <reference types="express" />
import { ExpressHttpDriver } from '../driver/ExpressHttpDriver';
import { IMiddleware } from './IMiddleware';
import { ExpressController } from '../controller/ExpressController';
import * as Express from 'express';
export interface IExpressMiddleware extends IMiddleware {
    native?(driver: ExpressHttpDriver): void;
    before?(request: Express.Request, response: Express.Response): Promise<any>;
    after?(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>;
}
