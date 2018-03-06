/// <reference types="express-serve-static-core" />
import { BodyParserMiddleware } from './BodyParserMiddleware';
import { IExpressMiddleware } from './IExpressMiddleware';
import { ExpressController } from '../controller/ExpressController';
export declare class BodyHandlebarsHelperMiddleware extends BodyParserMiddleware implements IExpressMiddleware {
    static className: string;
    after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>;
}
