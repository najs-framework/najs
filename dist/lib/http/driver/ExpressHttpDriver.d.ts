/// <reference types="express" />
import { IHttpDriver, HttpDriverSetupFunction, HttpDriverDidSetupHandler, HttpDriverStartOptions } from '../IHttpDriver';
import { IAutoload } from '../../core/IAutoload';
import { IRouteData } from '../IRouteData';
import * as Express from 'express';
export declare class ExpressHttpDriver implements IHttpDriver, IAutoload {
    static driverName: string;
    private express;
    private setupFunction?;
    private didSetupHandler?;
    getClassName(): string;
    getDriverName(): string;
    initialize(): void;
    private defaultInitialize();
    setup(setupFunction: HttpDriverSetupFunction<Express.Express>): this;
    driverDidSetup(handler: HttpDriverDidSetupHandler<Express.Express>): this;
    route(route: IRouteData): void;
    start(options: HttpDriverStartOptions): void;
    respondJson(response: Express.Response, value: any): void;
    respondRedirect(response: Express.Response, url: string, status: number): void;
}
