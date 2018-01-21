import { IRouteBuilder } from './interfaces/IRouteBuilder';
import { IRouteData } from './interfaces/IRouteData';
export declare class RouteCollection {
    static routes: IRouteBuilder[];
    static getData(): IRouteData[];
}
