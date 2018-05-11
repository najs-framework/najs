/// <reference path="../../contracts/Response.d.ts" />
import { IView } from './IViewGrammars';
export interface IResponseFactory {
    view<R = IView>(view: string): R;
    view<T extends Object = {}, R = IView>(view: string, variables: T): R;
    json<R = Najs.Contracts.Response>(value: any): R;
    jsonp<R = Najs.Contracts.Response>(value: any): R;
    redirect<R = Najs.Contracts.Response>(url: string): R;
    redirect<R = Najs.Contracts.Response>(url: string, status: number): R;
    back<R = Najs.Contracts.Response>(): R;
    back<R = Najs.Contracts.Response>(defaultUrl: string): R;
}
