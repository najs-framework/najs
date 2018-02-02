/// <reference types="node" />
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver';
import { IAutoload } from '../../core/IAutoload';
import { IRouteData } from '../routing/interfaces/IRouteData';
import { IMiddleware } from '../middleware/IMiddleware';
import * as Express from 'express';
import * as Http from 'http';
export declare type ExpressApp = Express.Express;
export declare type ExpressHandlers = Array<Express.RequestHandler | Express.ErrorRequestHandler>;
export declare class ExpressHttpDriver implements IHttpDriver, IAutoload {
    static METHODS: string[];
    static className: string;
    protected express: ExpressApp;
    protected server: Http.Server;
    constructor();
    protected setup(): ExpressApp;
    protected setupBodyParser(app: ExpressApp): void;
    protected setupCookieParser(app: ExpressApp): void;
    protected setupViewEngine(app: ExpressApp): void;
    getClassName(): string;
    getNativeDriver(): ExpressApp;
    route(route: IRouteData): void;
    protected getEndpointHandlers(method: string, path: string, route: IRouteData): ExpressHandlers;
    protected createBeforeMiddlewareWrapper(middlewareList: IMiddleware[]): (request: Express.Request, response: Express.Response, next: Express.NextFunction) => Promise<void>;
    protected createEndpointWrapper(controllerName: string, endpointName: string): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected createEndpointWrapperByObject(controllerObject: Object, endpointName: string): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected cloneControllerObject(controller: Object, request: Express.Request, response: Express.Response): Object;
    protected createEndpointWrapperByFunction(endpoint: Function): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected handleEndpointResult(response: Express.Response, result: any): Promise<any>;
    start(options: HttpDriverStartOptions): void;
    respondView(response: Express.Response, view: string, variables: Object): void;
    respondJson(response: Express.Response, value: any): void;
    respondJsonp(response: Express.Response, value: any): void;
    respondRedirect(response: Express.Response, url: string, status: number): void;
}
