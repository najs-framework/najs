import { IMiddleware } from './middleware/IMiddleware';
export declare class HttpKernel {
    protected middlewareGroups: {
        [key: string]: string[];
    };
    protected middleware: {
        [key: string]: string;
    };
    getMiddleware(name: string): IMiddleware | IMiddleware[] | undefined;
}
