/// <reference path="../../contracts/types/routing.d.ts" />
import { HttpMethod } from '../HttpMethod';
import { Controller } from '../controller/Controller';
import { RouteData } from './RouteData';
export declare type HttpMethodTarget = string | Controller | Function | Object;
export interface RouteBuilder extends Najs.Http.Routing.Verbs {
}
export declare class RouteBuilder implements Najs.Http.IRouteBuilder, Najs.Http.Routing.Control, Najs.Http.Routing.Group, Najs.Http.Routing.Named {
    protected data: RouteData;
    protected children: Array<Najs.Http.IRouteBuilder>;
    constructor();
    constructor(method: HttpMethod | 'all' | string, path: string);
    getRouteData(parent?: RouteData): Najs.Http.IRouteData[];
    registerChildRoute(route: Najs.Http.IRouteBuilder): void;
    shouldRegisterChildRoute(): boolean;
    hasChildRoute(): boolean;
    use(...list: Array<any>): any;
    middleware(...list: Array<any>): any;
    prefix(prefix: string): any;
    group(callback: () => void): Najs.Http.Routing.GroupChain;
    name(name: string): any;
    method(method: HttpMethod, path: string, arg0: HttpMethodTarget, arg1?: any): Najs.Http.Routing.VerbChain;
    private method_overload_3_params(method, path, arg0);
    private method_overload_4_params(method, path, arg0, arg1?);
    static readonly HttpVerbsSupported: string[];
}
