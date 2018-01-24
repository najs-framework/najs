/// <reference types="express" />
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver';
import { IAutoload } from '../../core/IAutoload';
import { IRouteData } from '../routing/interfaces/IRouteData';
import * as Express from 'express';
export declare type ExpressApp = Express.Express;
export declare class ExpressHttpDriver implements IHttpDriver, IAutoload {
    static className: string;
    private express;
    constructor();
    getClassName(): string;
    getNativeDriver(): ExpressApp;
    setup(): ExpressApp;
    route(route: IRouteData): void;
    start(options: HttpDriverStartOptions): void;
    respondJson(response: Express.Response, value: any): void;
    respondRedirect(response: Express.Response, url: string, status: number): void;
}
