import { IAutoload } from 'najs-binding';
import { IMiddleware } from './middleware/IMiddleware';
export declare type MiddlewareGroupDefinition = {
    [key: string]: string | string[];
};
export declare type MiddlewareDefinition = {
    [key: string]: string | string[] | MiddlewareGroupDefinition;
};
export declare class HttpKernel implements IAutoload {
    protected middlewareGroup: {
        [key: string]: string[];
    };
    protected globalMiddleware: MiddlewareDefinition;
    protected middleware: MiddlewareDefinition;
    protected findMiddlewareByName(name: string): string | string[] | MiddlewareGroupDefinition | undefined;
    getClassName(): string;
    getMiddleware(name: string): IMiddleware[];
    protected createGroupMiddleware(settings: MiddlewareGroupDefinition): IMiddleware[];
    protected createMiddleware(settings: string[] | string, className: string, params: string[]): IMiddleware[];
}
