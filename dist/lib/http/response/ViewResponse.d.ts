/// <reference path="../../contracts/HttpDriver.d.ts" />
/// <reference path="../../contracts/Response.d.ts" />
import { IView } from './IViewGrammars';
export declare class ViewResponse<T extends Object = {}> implements Najs.Contracts.Response, IView {
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
