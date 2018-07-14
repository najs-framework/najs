import { IHttpTest } from './IHttpTest';
import { TestSuite } from '../TestSuite';
import { HttpTestExpectations, IHttpTestExpectation } from './IHttpTestExpectation';
export declare abstract class HttpTestKit<T extends IHttpTest> {
    protected testSuite: TestSuite;
    constructor(testSuite: TestSuite);
    abstract makeRequest(method: string, url: string): T;
    abstract makeJsonExpectation(body?: any): IHttpTestExpectation<T>;
    abstract makeStatusExpectation(status: number): IHttpTestExpectation<T>;
    makeRequestAndSendData(method: string, url: string, data?: string | object): T;
    applyExpectations(test: T, ...expectations: HttpTestExpectations<T>): void;
}
