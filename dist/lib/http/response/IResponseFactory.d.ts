import { IView } from './types/IViewGrammars';
import { IResponse } from './IResponse';
export interface IResponseFactory {
    view<R = IView>(view: string): R;
    view<T extends Object = {}, R = IView>(view: string, variables: T): R;
    json<R = IResponse>(value: any): R;
    jsonp<R = IResponse>(value: any): R;
    redirect<R = IResponse>(url: string): R;
    redirect<R = IResponse>(url: string, status: number): R;
    back<R = IResponse>(): R;
    back<R = IResponse>(defaultUrl: string): R;
}
