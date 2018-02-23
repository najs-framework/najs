import { IAutoload } from 'najs-binding';
import { IMiddleware } from './middleware/IMiddleware';
export declare class HttpKernel implements IAutoload {
    protected middleware: {
        [key: string]: string | string[];
    };
    getClassName(): string;
    getMiddleware(name: string): IMiddleware[];
}
