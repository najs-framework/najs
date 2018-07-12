/// <reference path="../contracts/types/http.d.ts" />
import './supertest/JsonExpectation';
import * as SuperTest from 'supertest';
import { INajs } from '../core/INajs';
import { SuperTestExpectations, ISuperTestExpectation } from './supertest/ISuperTestExpectation';
export declare class TestSuite {
    protected static najs: INajs | undefined;
    protected static startOptions: Najs.Http.StartOptions;
    protected nativeHttpDriver: any;
    static getFramework(): INajs | undefined;
    static setFramework(najs: INajs, startOptions?: Najs.Http.StartOptions): INajs | undefined;
    static clear(): void;
    static runWithJest(testSuite: typeof TestSuite): typeof TestSuite;
    static jest(testSuite: typeof TestSuite): typeof TestSuite;
    setUp(): Promise<{}> | undefined;
    tearDown(): void;
    protected createSuperTest(): SuperTest.SuperTest<SuperTest.Test>;
    call(method: string | Najs.Http.HttpMethod, url: string, ...assertions: SuperTestExpectations): SuperTest.Test;
    get(url: string, ...assertions: SuperTestExpectations): SuperTest.Test;
    expectJson(body?: any): ISuperTestExpectation;
}
