import { IHttpTest } from './IHttpTest';
import { TestSuite } from '../TestSuite';
import { IHttpTestExpectation } from './IHttpTestExpectation';
export declare enum HttpExpectationEnum {
    Json = 0,
    Status = 1,
}
export declare abstract class HttpTestKit<T extends IHttpTest> {
    protected testSuite: TestSuite;
    constructor(testSuite: TestSuite);
    abstract makeRequest(method: string, url: string): T;
    abstract makeExpectation(name: HttpExpectationEnum, data: any[]): IHttpTestExpectation<T>;
    makeJsonExpectation(body?: any): IHttpTestExpectation<T>;
    makeStatusExpectation(status: number): IHttpTestExpectation<T>;
    makeRequestAndSendData(method: string, url: string, data?: string | object): T;
}
