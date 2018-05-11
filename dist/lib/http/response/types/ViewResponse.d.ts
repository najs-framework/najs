/// <reference path="../../../contracts/HttpDriver.d.ts" />
import { IAutoload } from 'najs-binding';
import { IView } from './IViewGrammars';
import { IResponse } from '../IResponse';
export declare class ViewResponse<T extends Object = {}> implements IResponse, IAutoload, IView {
    static className: string;
    protected view: string;
    protected variables: T;
    constructor(view: string);
    constructor(view: string, variables: T);
    getClassName(): string;
    respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>): void;
    with(name: string, value: any): this;
    getVariables(): T;
}
