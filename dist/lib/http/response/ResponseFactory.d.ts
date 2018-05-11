/// <reference path="../../contracts/Response.d.ts" />
import { IAutoload } from 'najs-binding';
import { Facade } from 'najs-facade';
import { IView } from './IViewGrammars';
import { IResponseFactory } from './IResponseFactory';
export declare class ResponseFactory extends Facade implements IResponseFactory, IAutoload {
    static className: string;
    getClassName(): string;
    view<R = IView>(view: string): R;
    view<T extends Object = {}, R = IView>(view: string, variables: T): R;
    json<R = Najs.Contracts.Response>(value: any): R;
    jsonp<R = Najs.Contracts.Response>(value: any): R;
    redirect<R = Najs.Contracts.Response>(url: string): R;
    redirect<R = Najs.Contracts.Response>(url: string, status: number): R;
    back<R = Najs.Contracts.Response>(): R;
    back<R = Najs.Contracts.Response>(defaultUrl: string): R;
}
