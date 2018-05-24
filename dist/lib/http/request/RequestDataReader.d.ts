/// <reference path="../../contracts/types/http.d.ts" />
export declare class RequestDataReader implements Najs.Http.IRequestDataReader {
    protected data: Object;
    constructor(data: Object);
    get<T extends any>(path: string): T;
    get<T extends any>(path: string, defaultValue: T): T;
    has(path: string): boolean;
    exists(path: string): boolean;
    all(): Object;
    only(path: string): Object;
    only(paths: string[]): Object;
    only(...args: Array<string | string[]>): Object;
    except(path: string): Object;
    except(paths: string[]): Object;
    except(...args: Array<string | string[]>): Object;
}
