/// <reference types="express" />
import { IExpressMiddleware } from './IExpressMiddleware';
import { Request, Response } from 'express';
import { ExpressController } from '../../http/controller/ExpressController';
export declare class AuthMiddleware implements IExpressMiddleware {
    static className: string;
    protected guard: string | undefined;
    constructor(guard?: string);
    before(request: Request, response: Response, controller: ExpressController): Promise<void>;
}
