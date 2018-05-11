/// <reference path="../../contracts/types/http.d.ts" />
/// <reference types="express" />
import { HttpKernel } from '../HttpKernel';
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver';
import { IAutoload } from 'najs-binding';
import { Controller } from '../controller/Controller';
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
    getClassName(): string;
    getNativeDriver(): ExpressApp;
    route(route: Najs.Http.IRouteData): void;
    protected getEndpointHandlers(method: string, path: string, route: Najs.Http.IRouteData): ExpressHandlers;
    protected createHandlersForRoute(route: Najs.Http.IRouteData, middlewareList: Najs.Http.IMiddleware[]): ExpressHandlers;
    protected createEndpointWrapper(controllerName: string, endpointName: string, middleware: Najs.Http.IMiddleware[]): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected createEndpointWrapperByObject(controllerObject: Object, endpointName: string, middleware: Najs.Http.IMiddleware[]): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected cloneControllerObject(controller: Object, request: Express.Request, response: Express.Response): Object;
    protected createEndpointWrapperByFunction(endpoint: Function, middleware: Najs.Http.IMiddleware[]): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected triggerEndpoint(controller: Controller, endpoint: Function, request: Express.Request, response: Express.Response, middleware: Najs.Http.IMiddleware[]): Promise<any>;
    protected handleEndpointResult(request: Express.Request, response: Express.Response, result: any, controller: Controller, middleware: Najs.Http.IMiddleware[]): Promise<any>;
    start(options?: HttpDriverStartOptions): void;
    respondView(response: Express.Response, view: string, variables: Object): void;
    respondJson(response: Express.Response, value: any): void;
    respondJsonp(response: Express.Response, value: any): void;
    respondRedirect(response: Express.Response, url: string, status: number): void;
}
