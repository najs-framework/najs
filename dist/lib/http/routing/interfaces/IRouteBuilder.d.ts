import { IRouteData } from './IRouteData';
export interface IRouteBuilder {
    getRouteData(parent?: Partial<IRouteData>): IRouteData[];
    hasChildRoute(): boolean;
    registerChildRoute(route: IRouteBuilder): void;
    shouldRegisterChildRoute(): boolean;
}
