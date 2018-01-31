import { IView } from './IViewGrammars';
import { IResponse } from '../IResponse';
import { IHttpDriver } from '../../driver/IHttpDriver';
export declare class ViewResponse<T extends Object = {}> implements IResponse, IView {
    protected view: string;
    protected variables: T;
    constructor(view: string);
    constructor(view: string, variables: T);
    respond(response: any, driver: IHttpDriver): void;
    with(name: string, value: any): this;
    getVariables(): T;
}
