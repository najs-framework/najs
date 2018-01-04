import { RouteBuilder } from '../private/RouteBuilder';
import { RouteBuilderAdvance } from '../private/RouteBuilderAdvance';
export declare class Route {
    static group(callback: () => void): void;
    static middleware(middleware: string): RouteBuilderAdvance;
    static prefix(prefix: string): RouteBuilderAdvance;
    static redirect(...args: Array<any>): void;
    static get(path: string): RouteBuilder;
    static post(path: string): RouteBuilder;
    private static register<T>(route);
}
