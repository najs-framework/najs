/// <reference types="express" />
import { IAutoload } from 'najs-binding';
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase';
import * as Express from 'express';
import { ExpressController } from '../../controller/ExpressController';
export declare class BodyParserMiddleware extends ExpressMiddlewareBase implements IAutoload {
    static className: string;
    protected useJson: boolean;
    protected useRaw: boolean;
    protected useUrlEncoded: boolean;
    protected useText: boolean;
    getClassName(): string;
    parseParams(name: string, ...loaders: string[]): void;
    protected mapUsedLoaders(loaders: string[]): void;
    protected getJsonOptions(): undefined;
    protected getRawOptions(): undefined;
    protected getTextOptions(): undefined;
    protected getUrlEncodedOptions(): {
        extended: boolean;
    };
    createMiddleware(): Express.Handler | Express.Handler[] | undefined;
    after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>;
}
