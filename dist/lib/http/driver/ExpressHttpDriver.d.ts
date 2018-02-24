/// <reference types="express" />
/// <reference types="node" />
import '../session/ExpressSessionMemoryStore';
import { HttpKernel } from './../HttpKernel';
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver';
import { IAutoload } from 'najs-binding';
import { IRouteData } from '../routing/interfaces/IRouteData';
import { IMiddleware } from '../middleware/IMiddleware';
import * as Express from 'express';
import * as Http from 'http';
export declare type ExpressApp = Express.Express;
export declare type ExpressHandlers = Array<Express.RequestHandler | Express.ErrorRequestHandler>;
export declare class ExpressHttpDriver implements IHttpDriver, IAutoload {
    static METHODS: string[];
    static className: string;
    static setXPoweredByMiddleware(poweredBy?: string): (request: Express.Request, response: Express.Response, next: Express.NextFunction) => void;
    static addRequestIdMiddleware(poweredBy?: string): any;
    protected express: ExpressApp;
    protected server: Http.Server;
    protected httpKernel: HttpKernel;
    constructor();
    protected setup(): ExpressApp;
    protected setupBodyParser(app: ExpressApp): void;
    protected setupCookieParser(app: ExpressApp): void;
    protected setupSession(app: ExpressApp): void;
    protected setupViewEngine(app: ExpressApp): void;
    protected setupStaticAssets(app: ExpressApp): void;
    getClassName(): string;
    getNativeDriver(): ExpressApp;
    route(route: IRouteData): void;
    protected getEndpointHandlers(method: string, path: string, route: IRouteData): ExpressHandlers;
    protected getMiddlewareList(middleware: any): IMiddleware[];
    protected createBeforeMiddlewareWrapper(middlewareList: IMiddleware[]): (request: Express.Request, response: Express.Response, next: Express.NextFunction) => Promise<void>;
    protected createNativeMiddlewareWrapper(middlewareList: IMiddleware[]): void;
    protected createEndpointWrapper(controllerName: string, endpointName: string, middleware: IMiddleware[]): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected createEndpointWrapperByObject(controllerObject: Object, endpointName: string, middleware: IMiddleware[]): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected cloneControllerObject(controller: Object, request: Express.Request, response: Express.Response): Object;
    protected createEndpointWrapperByFunction(endpoint: Function, middleware: IMiddleware[]): (request: Express.Request, response: Express.Response) => Promise<void>;
    protected applyAfterMiddlewareWrapper(middlewareList: IMiddleware[], request: Express.Request, response: Express.Response, value: any): Promise<any>;
    protected handleEndpointResult(request: Express.Request, response: Express.Response, result: any, middleware: IMiddleware[]): Promise<any>;
    start(options?: HttpDriverStartOptions): void;
    respondView(response: Express.Response, view: string, variables: Object): void;
    respondJson(response: Express.Response, value: any): void;
    respondJsonp(response: Express.Response, value: any): void;
    respondRedirect(response: Express.Response, url: string, status: number): void;
}
