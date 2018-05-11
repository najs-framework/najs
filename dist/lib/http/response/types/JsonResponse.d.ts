/// <reference path="../../../contracts/HttpDriver.d.ts" />
import { IAutoload } from 'najs-binding';
import { IResponse } from '../IResponse';
export declare class JsonResponse implements IResponse, IAutoload {
    static className: string;
    protected value: any;
    constructor(value: any);
    getClassName(): string;
    respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>): void;
}
