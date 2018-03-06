import { IHttpDriver } from '../driver/IHttpDriver';
import { IncomingMessage, ServerResponse } from 'http';
export interface IResponse {
    respond(request: IncomingMessage, response: ServerResponse, driver: IHttpDriver): void;
}
export declare function isIResponse(arg: any): boolean;
