import { HttpKernel } from '../../HttpKernel';
import { IHttpDriver } from '../IHttpDriver';
import { IMiddleware, NativeMiddleware } from '../../middleware/IMiddleware';
import { IRouteData } from '../../routing/interfaces/IRouteData';
export declare class RouteMiddlewareUtil {
    static getMiddlewareListOfRoute(route: IRouteData, httpKernel: HttpKernel): IMiddleware[];
    protected static getMiddlewareList(httpKernel: HttpKernel, middleware: any): IMiddleware[];
    static createNativeMiddlewareHandlers(middlewareList: IMiddleware[], driver: IHttpDriver): NativeMiddleware[];
    static applyBeforeMiddleware(middlewareList: IMiddleware[], request: any, response: any, controller: any): Promise<void>;
    static applyAfterMiddleware(middlewareList: IMiddleware[], request: any, response: any, value: any, controller: any): Promise<any>;
}
