/// <reference path="../../../contracts/types/http.d.ts" />
import { HttpMethod } from '../../HttpMethod';
import { Controller } from '../../controller/Controller';
export declare type RouteMiddleware = string | Najs.Http.IMiddleware | Function;
export declare type RouteController = string | Controller | Object;
export declare type RouteEndpoint = string | Function;
export interface IRouteData {
    metadata?: Object;
    name?: string;
    method: HttpMethod | 'all' | string;
    path: string;
    prefix: string;
    middleware: Array<RouteMiddleware>;
    controller?: RouteController;
    endpoint?: RouteEndpoint;
}
