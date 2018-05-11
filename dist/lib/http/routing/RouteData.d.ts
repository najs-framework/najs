/// <reference path="../../contracts/types/http.d.ts" />
import { HttpMethod } from '../HttpMethod';
export declare class RouteData implements Partial<Najs.Http.IRouteData> {
    name?: string;
    metadata?: Object;
    method?: HttpMethod | 'all' | string;
    path?: string;
    prefix: string;
    middleware: Array<Najs.Http.RouteMiddleware>;
    controller?: Najs.Http.RouteController;
    endpoint?: Najs.Http.RouteEndpoint;
    isPrefixMerged: boolean;
    constructor(method?: HttpMethod | 'all' | string, path?: string);
    isValid(): boolean;
    private hasEndpointInController();
    private hasRequiredData();
    mergeParentData(parent?: RouteData): void;
    getData(parent?: RouteData): Najs.Http.IRouteData | undefined;
}
