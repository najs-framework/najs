import { IRouteBuilder } from './interfaces/IRouteBuilder';
import { IRouteData } from './interfaces/IRouteData';
export declare class RouteCollection {
    static routes: Array<IRouteBuilder>;
    static getData(): Array<IRouteData>;
    static has(): void;
}
