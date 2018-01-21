import { IRouteData, RouteMiddleware, RouteEndpoint, RouteController } from './interfaces/IRouteData';
import { HttpMethod } from '../HttpMethod';
export declare class RouteData implements Partial<IRouteData> {
    name?: string;
    metadata?: Object;
    method?: HttpMethod | 'all' | string;
    path?: string;
    prefix: string;
    middleware: Array<RouteMiddleware>;
    controller?: RouteController;
    endpoint?: RouteEndpoint;
    isPrefixMerged: boolean;
    constructor(method?: HttpMethod | 'all' | string, path?: string);
    isValid(): boolean;
    mergeParentData(parent?: RouteData): void;
    getData(parent?: RouteData): IRouteData | undefined;
}
