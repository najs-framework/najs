import { IHttpDriver } from '../driver/IHttpDriver';
export interface IMiddleware {
    native?(driver: IHttpDriver): any;
    before?(request: any, response: any): Promise<any>;
    after?(request: any, response: any, result: any): Promise<any>;
}
