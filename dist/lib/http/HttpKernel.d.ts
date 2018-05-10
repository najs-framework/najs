/// <reference path="../contracts/types/http.d.ts" />
import { IAutoload } from 'najs-binding';
export declare type MiddlewareGroupDefinition = {
    [key: string]: string | string[];
};
export declare type MiddlewareDefinition = {
    [key: string]: string | string[] | MiddlewareGroupDefinition;
};
export declare class HttpKernel implements IAutoload {
    protected globalMiddleware: MiddlewareDefinition;
    protected middleware: MiddlewareDefinition;
    protected findMiddlewareByName(name: string): string | string[] | MiddlewareGroupDefinition | undefined;
    getClassName(): string;
    getMiddleware(name: string): Najs.Http.IMiddleware[];
    protected createGroupMiddleware(settings: MiddlewareGroupDefinition): Najs.Http.IMiddleware[];
    protected createMiddleware(settings: string[] | string, className: string, params: string[]): Najs.Http.IMiddleware[];
}
