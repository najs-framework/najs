import { IAutoload } from 'najs-binding';
import { Facade } from './../../facades/Facade';
import { IView } from './types/IViewGrammars';
import { IResponse } from './IResponse';
import { IResponseFactory } from './IResponseFactory';
export declare class ResponseFactory extends Facade implements IResponseFactory, IAutoload {
    static className: string;
    getClassName(): string;
    view<R = IView>(view: string): R;
    view<T extends Object = {}, R = IView>(view: string, variables: T): R;
    json<R = IResponse>(value: any): R;
    jsonp<R = IResponse>(value: any): R;
    redirect<R = IResponse>(url: string): R;
    redirect<R = IResponse>(url: string, status: number): R;
    back<R = IResponse>(): R;
    back<R = IResponse>(defaultUrl: string): R;
}
