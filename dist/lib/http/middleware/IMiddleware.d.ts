import { IHttpDriver } from '../driver/IHttpDriver';
export interface IMiddleware {
    native?(driver: IHttpDriver): any;
    before?(request: any): Promise<any>;
    after?(request: any, response: any): Promise<any>;
}
