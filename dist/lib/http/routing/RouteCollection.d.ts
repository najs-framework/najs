/// <reference path="../../contracts/types/http.d.ts" />
export declare class RouteCollection {
    private static isChanged;
    private static routes;
    private static routeData;
    private static routeDataNamed;
    static getData(): Najs.Http.IRouteData[];
    static register<T extends Najs.Http.IRouteBuilder>(route: T): T;
    static hasName(name: string): boolean;
    static findOrFail(name: string): Najs.Http.IRouteData;
}
