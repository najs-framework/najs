/// <reference path="../../../contracts/HttpDriver.d.ts" />
import { IAutoload } from 'najs-binding';
import { IResponse } from '../IResponse';
export declare class BackResponse implements IResponse, IAutoload {
    static className: string;
    protected defaultUrl: string;
    constructor(defaultUrl?: string);
    getClassName(): string;
    respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>): void;
}
