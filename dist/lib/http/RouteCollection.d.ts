import { IRoute } from './IRoute';
import { IRouteData } from './IRouteData';
export declare class RouteCollection {
    static routes: Array<IRoute>;
    static getData(): Array<IRouteData>;
    static has(): void;
}
