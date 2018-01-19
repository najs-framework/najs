import { HttpMethod } from '../../HttpMethod';
import { Controller } from '../../controller/Controller';
export declare type RouteMiddleware = string | ((request: any, response: any, next: () => void) => void);
export declare type RouteController = string | Controller;
export declare type RouteEndpoint = string | Function;
export interface IRouteData {
    metadata?: Object;
    name?: string;
    method: HttpMethod | string;
    path: string;
    prefix: string;
    controller: RouteController;
    endpoint: RouteEndpoint;
    middleware: Array<RouteMiddleware>;
}
