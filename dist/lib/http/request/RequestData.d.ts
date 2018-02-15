import { IRequestRetriever } from './IRequestRetriever';
export declare class RequestData implements IRequestRetriever {
    protected data: Object;
    constructor(data: Object);
    get<T extends any>(path: string): T;
    get<T extends any>(path: string, defaultValue: T): T;
    has(path: string): boolean;
    all(): Object;
    only(path: string): Object;
    only(paths: string[]): Object;
    only(...args: Array<string | string[]>): Object;
    except(path: string): Object;
    except(paths: string[]): Object;
    except(...args: Array<string | string[]>): Object;
}
