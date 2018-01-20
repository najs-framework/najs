import { IMiddleware } from './IMiddleware';
export declare class Middleware implements IMiddleware {
    before(request: any): Promise<any>;
    after(request: any, response: any): Promise<any>;
}
