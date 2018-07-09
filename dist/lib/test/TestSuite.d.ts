/// <reference path="../contracts/types/http.d.ts" />
import { INajs } from '../core/INajs';
export declare class TestSuite {
    protected static najs: INajs | undefined;
    protected static startOptions: Najs.Http.StartOptions;
    protected nativeHttpDriver: any;
    static getFramework(): INajs | undefined;
    static setFramework(najs: INajs, startOptions?: Najs.Http.StartOptions): INajs | undefined;
    static clear(): void;
    setUp(): Promise<{}> | undefined;
    tearDown(): void;
}
