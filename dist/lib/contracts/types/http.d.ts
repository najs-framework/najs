/// <reference path="../HttpDriver.d.ts" />
declare namespace Najs.Http {
    interface CookieOptions {
        maxAge?: number;
        signed?: boolean;
        expires?: Date | boolean;
        httpOnly?: boolean;
        path?: string;
        domain?: string;
        secure?: boolean | 'auto';
        encode?: (val: string) => void;
        sameSite?: boolean | string;
    }
    type StartOptions = {
        createServer?: boolean;
        port?: number;
        host?: any;
    };
    type HttpMethod = 'CHECKOUT' | 'COPY' | 'DELETE' | 'GET' | 'HEAD' | 'LOCK' | 'MERGE' | 'MKACTIVITY' | 'MKCOL' | 'MOVE' | 'M-SEARCH' | 'NOTIFY' | 'OPTIONS' | 'PATCH' | 'POST' | 'PURGE' | 'PUT' | 'REPORT' | 'SEARCH' | 'SUBSCRIBE' | 'TRACE' | 'UNLOCK' | 'UNSUBSCRIBE';
    type NativeMiddleware = (request: any, response: any, next: Function) => void;
    interface IMiddleware {
        native?(driver: Contracts.HttpDriver<any, any>): NativeMiddleware | NativeMiddleware[] | undefined;
        before?(request: any, response: any, controller: any): Promise<any>;
        after?(request: any, response: any, result: any, controller: any): Promise<any>;
    }
    type RouteMiddleware = string | IMiddleware | NativeMiddleware;
    type RouteController = string | IController | Object;
    type RouteEndpoint = string | Function;
    interface IRouteData {
        metadata?: Object;
        name?: string;
        method: HttpMethod | 'all' | string;
        path: string;
        prefix: string;
        middleware: Array<RouteMiddleware>;
        controller?: string | IController | Object;
        endpoint?: string | Function;
    }
    interface IRouteBuilder {
        getRouteData(parent?: Partial<IRouteData>): IRouteData[];
        hasChildRoute(): boolean;
        registerChildRoute(route: IRouteBuilder): void;
        shouldRegisterChildRoute(): boolean;
    }
    interface IController<Request extends NodeJS.ReadableStream = NodeJS.ReadableStream, Response extends NodeJS.WritableStream = NodeJS.WritableStream> extends Najs.Contracts.Autoload {
        request: Request;
        response: Response;
        input: any;
        auth?: any;
        session?: any;
        cookie?: Najs.Contracts.Cookie;
    }
    interface IRequestDataWriter {
        /**
         * sets value to a path
         *
         * @param {string} path
         * @param {mixed} value
         */
        set<T extends any>(path: string, value: T): this;
        /**
         * an alias of .set()
         *
         * @param {string} path
         * @param {mixed} value
         */
        put<T extends any>(path: string, value: T): this;
        /**
         * an alias of .set()
         *
         * @param {string} path
         * @param {mixed} value
         */
        push<T extends any>(path: string, value: T): this;
        /**
         * retrieves and deletes an item in a single statement
         *
         * @param {string} path
         */
        pull<T extends any>(path: string): T;
        /**
         * retrieves and deletes an item in a single statement
         *
         * @param {string} path
         * @param {mixed} defaultValue
         */
        pull<T extends any>(path: string, defaultValue: T): T;
        /**
         * deletes an item by path
         *
         * @param {string} path
         */
        delete(path: string): this;
        /**
         * an alias of .delete()
         *
         * @param {string} path
         */
        remove(path: string): this;
        /**
         * an alias of .delete()
         *
         * @param {string} path
         */
        forget(path: string): this;
        /**
         * clears all items
         */
        clear(): this;
        /**
         * clears all items - an alias of .clear()
         */
        flush(): this;
    }
}
