import { IHttpDriver } from '../driver/IHttpDriver';
export declare type NativeMiddleware = (request: any, response: any, next: Function) => void;
export interface IMiddleware {
    native?(driver: IHttpDriver): NativeMiddleware | NativeMiddleware[] | undefined;
    before?(request: any, response: any, controller: any): Promise<any>;
    after?(request: any, response: any, result: any, controller: any): Promise<any>;
}
