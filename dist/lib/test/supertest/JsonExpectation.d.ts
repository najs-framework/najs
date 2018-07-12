import * as SuperTest from 'supertest';
import { ISuperTestExpectation } from './ISuperTestExpectation';
export declare class JsonExpectation implements ISuperTestExpectation {
    static className: string;
    protected body: any;
    constructor(body?: any);
    injectExpectation(test: SuperTest.Test): SuperTest.Test;
}
