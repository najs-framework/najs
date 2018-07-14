import './expectations/JsonExpectation';
import './expectations/StatusExpectation';
import * as SuperTest from 'supertest';
import { HttpTestKit } from '../HttpTestKit';
import { IHttpTestExpectation } from '../IHttpTestExpectation';
export declare class SupertestKit extends HttpTestKit<SuperTest.Test> {
    protected createSuperTest(): SuperTest.SuperTest<SuperTest.Test>;
    makeRequest(method: string, url: string): SuperTest.Test;
    makeJsonExpectation(body?: any): IHttpTestExpectation<SuperTest.Test>;
    makeStatusExpectation(status: number): IHttpTestExpectation<SuperTest.Test>;
}
