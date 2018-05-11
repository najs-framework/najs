/// <reference path="../../contracts/types/http.d.ts" />
/// <reference path="../../contracts/RouteFactory.d.ts" />
import { Facade } from 'najs-facade';
export interface RouteFactory extends Najs.Contracts.RouteFactory {
}
export declare class RouteFactory extends Facade {
    static className: string;
    getClassName(): string;
    createByName(name: string): string;
    createByName(name: string, param: Object): string;
    createByName(name: string, param: Object, options: {
        encode: (value: string) => string;
    }): string;
}
