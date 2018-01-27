import { IHttpDriver } from '../driver/IHttpDriver';
export interface IResponse {
    respond(response: any, driver: IHttpDriver): void;
}
export declare function isIResponse(arg: any): boolean;
