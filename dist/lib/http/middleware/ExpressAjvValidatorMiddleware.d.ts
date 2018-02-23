/// <reference types="express-serve-static-core" />
import { IAutoload } from 'najs-binding';
import { IExpressMiddleware } from './IExpressMiddleware';
export declare class ExpressAjvValidatorMiddleware implements IExpressMiddleware, IAutoload {
    static className: string;
    getClassName(): string;
    before(request: Express.Request, response: Express.Response): Promise<void>;
    after(request: Express.Request, response: Express.Response, result: any): Promise<void>;
}
