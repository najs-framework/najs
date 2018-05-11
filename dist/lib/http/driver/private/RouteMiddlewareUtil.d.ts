/// <reference path="../../../contracts/HttpDriver.d.ts" />
/// <reference path="../../../contracts/types/http.d.ts" />
import { HttpKernel } from '../../HttpKernel';
export declare class RouteMiddlewareUtil {
    static getMiddlewareListOfRoute(route: Najs.Http.IRouteData, httpKernel: HttpKernel): Najs.Http.IMiddleware[];
    protected static getMiddlewareList(httpKernel: HttpKernel, middleware: any): Najs.Http.IMiddleware[];
    static createNativeMiddlewareHandlers(middlewareList: Najs.Http.IMiddleware[], driver: Najs.Contracts.HttpDriver<any, any>): Najs.Http.NativeMiddleware[];
    static applyBeforeMiddleware(middlewareList: Najs.Http.IMiddleware[], request: any, response: any, controller: any): Promise<void>;
    static applyAfterMiddleware(middlewareList: Najs.Http.IMiddleware[], request: any, response: any, value: any, controller: any): Promise<any>;
}
