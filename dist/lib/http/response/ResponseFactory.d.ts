import { IAutoload } from './../../core/IAutoload';
import { Facade } from './../../facades/Facade';
import { IView } from './types/IViewGrammars';
import { IResponse } from './IResponse';
import { IResponseFactory } from './IResponseFactory';
export declare class ResponseFactory extends Facade implements IResponseFactory, IAutoload {
    static className: string;
    getClassName(): string;
    view(view: string): IView;
    view<T extends Object = {}>(view: string, variables: T): IView;
    json(value: any): IResponse;
    jsonp(value: any): IResponse;
    redirect(url: string): IResponse;
    redirect(url: string, status: number): IResponse;
    back(): IResponse;
    back(defaultUrl: string): IResponse;
}
