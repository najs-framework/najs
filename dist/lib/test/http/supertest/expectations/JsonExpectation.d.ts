import * as SuperTest from 'supertest';
import { IHttpTestExpectation } from '../../IHttpTestExpectation';
export declare class JsonExpectation implements Najs.Contracts.Autoload, IHttpTestExpectation<SuperTest.Test> {
    static className: string;
    protected body: any;
    constructor(body?: any);
    getClassName(): string;
    injectExpectation(test: SuperTest.Test): SuperTest.Test;
}
