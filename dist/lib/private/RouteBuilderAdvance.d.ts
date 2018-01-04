import { IRoute } from '../http/IRoute';
import { IRouteData } from '../http/IRouteData';
import { RouteBuilder } from './RouteBuilder';
export declare class RouteBuilderAdvance extends RouteBuilder {
    protected children: Array<IRoute>;
    constructor(method: string, path: string);
    getRouteData(): IRouteData;
    registerChildRoute(route: IRoute): void;
    shouldRegisterChildRoute(): boolean;
    hasChildRoute(): boolean;
    middleware(middleware: string): RouteBuilderAdvance;
    prefix(prefix: string): RouteBuilderAdvance;
    get(path: string): RouteBuilder;
    post(path: string): RouteBuilder;
    group(callback: () => void): void;
}
