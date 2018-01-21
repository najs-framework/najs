import { IRouteBuilder } from './interfaces/IRouteBuilder';
import { IRouteData } from './interfaces/IRouteData';
export declare class RouteCollection {
    private static isChanged;
    private static routes;
    private static routeData;
    private static routeDataNamed;
    static getData(): IRouteData[];
    static register<T extends IRouteBuilder>(route: T): T;
    static hasName(name: string): boolean;
}
