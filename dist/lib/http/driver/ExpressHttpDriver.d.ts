/// <reference types="express" />
import { HttpKernel } from '../HttpKernel';
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver';
import { IAutoload } from 'najs-binding';
import { IRouteData } from '../routing/interfaces/IRouteData';
import { Controller } from '../controller/Controller';
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
    protected httpKernel: HttpKernel;
    constructor();
    protected setup(): ExpressApp;
    protected setupViewEngine(app: ExpressApp): void;
    protected setupStaticAssets(app: ExpressApp): void;
    getClassName(): string;
    getNativeDriver(): ExpressApp;
    route(route: IRouteData): void;
    protected getEndpointHandlers(method: string, path: string, route: IRouteData): ExpressHandlers;
    protected createHandlersForRoute(route: IRouteData, middlewareList: IMiddleware[]): ExpressHandlers;
    protected createEndpointWrapper(controllerName: string, endpointName: string, middleware: IMiddleware[]): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected createEndpointWrapperByObject(controllerObject: Object, endpointName: string, middleware: IMiddleware[]): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected cloneControllerObject(controller: Object, request: Express.Request, response: Express.Response): Object;
    protected createEndpointWrapperByFunction(endpoint: Function, middleware: IMiddleware[]): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected triggerEndpoint(controller: Controller, endpoint: Function, request: Express.Request, response: Express.Response, middleware: IMiddleware[]): Promise<any>;
    protected handleEndpointResult(request: Express.Request, response: Express.Response, result: any, controller: Controller, middleware: IMiddleware[]): Promise<any>;
    start(options?: HttpDriverStartOptions): void;
    respondView(response: Express.Response, view: string, variables: Object): void;
    respondJson(response: Express.Response, value: any): void;
    respondJsonp(response: Express.Response, value: any): void;
    respondRedirect(response: Express.Response, url: string, status: number): void;
}
