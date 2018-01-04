import { IRouteData } from './IRouteData';
export declare type HttpDriverSetupFunction<T = any> = () => T;
export declare type HttpDriverDidSetupHandler<T = any> = (instance: T) => void;
export declare type HttpDriverStartOptions = {
    port: number;
    host: any;
};
export interface IHttpDriver {
    getDriverName(): string;
    initialize(): void;
    route(data: IRouteData): void;
    setup(setupFunction: HttpDriverSetupFunction): this;
    driverDidSetup(handler: HttpDriverDidSetupHandler): this;
    respondJson(response: any, value: any): void;
    respondRedirect(response: any, path: string, code: number): void;
    start(options: HttpDriverStartOptions): void;
}
