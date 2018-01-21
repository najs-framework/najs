import { HttpMethod } from '../../HttpMethod';
import { Controller } from '../../controller/Controller';
import { IMiddleware } from '../../middleware/IMiddleware';
export declare type RouteMiddleware = string | IMiddleware | Function;
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
