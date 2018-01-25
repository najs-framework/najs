/// <reference types="express" />
/// <reference types="node" />
import { IHttpDriver, HttpDriverStartOptions } from './IHttpDriver';
import { IAutoload } from '../../core/IAutoload';
import { IRouteData } from '../routing/interfaces/IRouteData';
import * as Express from 'express';
import * as Http from 'http';
export declare type ExpressApp = Express.Express;
export declare class ExpressHttpDriver implements IHttpDriver, IAutoload {
    static className: string;
    protected express: ExpressApp;
    protected server: Http.Server;
    constructor();
    protected setup(): ExpressApp;
    getClassName(): string;
    getNativeDriver(): ExpressApp;
    route(route: IRouteData): void;
    start(options: HttpDriverStartOptions): void;
    respondJson(response: Express.Response, value: any): void;
    respondRedirect(response: Express.Response, url: string, status: number): void;
}
