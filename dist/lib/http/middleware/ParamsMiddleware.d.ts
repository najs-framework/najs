/// <reference types="express-serve-static-core" />
import { IExpressMiddleware } from './IExpressMiddleware';
import { ExpressController } from '../controller/ExpressController';
export declare class ParamsMiddleware implements IExpressMiddleware {
    static className: string;
    after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>;
}
