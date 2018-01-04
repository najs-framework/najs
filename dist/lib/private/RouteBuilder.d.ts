import { IRoute } from '../http/IRoute';
import { IRouteData } from '../http/IRouteData';
export declare class RouteBuilder implements IRoute {
    protected data: IRouteData;
    constructor(method: string, path: string);
    getRouteData(): IRouteData;
    registerChildRoute(route: IRoute): void;
    shouldRegisterChildRoute(): boolean;
    hasChildRoute(): boolean;
    name(name: string): this;
    validateInput(): this;
}
