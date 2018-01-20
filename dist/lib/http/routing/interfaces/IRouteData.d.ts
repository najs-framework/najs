import { HttpMethod } from '../../HttpMethod';
import { Controller } from '../../controller/Controller';
import { IMiddleware } from '../../middleware/IMiddleware';
export declare type RouteMiddleware = string | IMiddleware | Function;
export declare type RouteController = string | Controller | Object;
export declare type RouteEndpoint = string | Function;
export interface IRouteData {
    metadata?: Object;
    name?: string;
    method: HttpMethod | string;
    path: string;
    prefix: string;
    controller?: RouteController;
    endpoint?: RouteEndpoint;
    middleware: Array<RouteMiddleware>;
}
