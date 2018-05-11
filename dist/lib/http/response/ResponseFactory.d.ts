/// <reference path="../../contracts/Response.d.ts" />
/// <reference path="../../contracts/ViewResponse.d.ts" />
/// <reference path="../../contracts/ResponseFactory.d.ts" />
import { Facade } from 'najs-facade';
export declare class ResponseFactory extends Facade implements Najs.Contracts.ResponseFactory {
    static className: string;
    getClassName(): string;
    view<T extends Object = {}>(view: string, variables?: T): Najs.Contracts.ViewResponse;
    json(value: any): Najs.Contracts.Response;
    jsonp(value: any): Najs.Contracts.Response;
    redirect(url: string, status?: number): Najs.Contracts.Response;
    back(defaultUrl?: string): Najs.Contracts.Response;
}
