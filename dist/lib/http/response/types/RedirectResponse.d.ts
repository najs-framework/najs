/// <reference path="../../../contracts/HttpDriver.d.ts" />
import { IAutoload } from 'najs-binding';
import { IResponse } from '../IResponse';
export declare class RedirectResponse implements IResponse, IAutoload {
    static className: string;
    protected url: string;
    protected status: number;
    constructor(url: string, status?: number);
    getClassName(): string;
    respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>): void;
}
