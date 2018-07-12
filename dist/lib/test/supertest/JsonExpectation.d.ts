import * as SuperTest from 'supertest';
import { ISuperTestExpectation } from './ISuperTestExpectation';
export declare class JsonExpectation implements Najs.Contracts.Autoload, ISuperTestExpectation {
    static className: string;
    protected body: any;
    constructor(body?: any);
    getClassName(): string;
    injectExpectation(test: SuperTest.Test): SuperTest.Test;
}
