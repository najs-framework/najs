/// <reference path="../../contracts/types/http.d.ts" />
import { RequestDataReader } from './RequestDataReader';
export declare class RequestDataWriter extends RequestDataReader implements Najs.Http.IRequestDataWriter {
    set<T extends any>(path: string, value: T): this;
    put<T extends any>(path: string, value: T): this;
    push<T extends any>(path: string, value: T): this;
    pull<T extends any>(path: string, defaultValue?: T): T;
    delete(path: string): this;
    remove(path: string): this;
    forget(path: string): this;
    clear(): this;
    flush(): this;
}
