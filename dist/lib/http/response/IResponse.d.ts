/// <reference path="../../contracts/HttpDriver.d.ts" />
import { IncomingMessage, ServerResponse } from 'http';
export interface IResponse {
    respond(request: IncomingMessage, response: ServerResponse, driver: Najs.Contracts.HttpDriver<any, any>): void;
}
export declare function isIResponse(arg: any): boolean;
