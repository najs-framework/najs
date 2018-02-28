import { IAutoload } from 'najs-binding';
import { IMiddleware } from './middleware/IMiddleware';
export declare class HttpKernel implements IAutoload {
    protected globalMiddleware: {
        [key: string]: string | string[];
    };
    protected middleware: {
        [key: string]: string | string[];
    };
    protected findMiddlewareByName(name: string): string | string[] | undefined;
    getClassName(): string;
    getMiddleware(name: string): IMiddleware[];
}
