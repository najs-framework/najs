import * as SuperTest from 'supertest';
import { IHttpTestExpectation } from '../../IHttpTestExpectation';
export declare class StatusExpectation implements Najs.Contracts.Autoload, IHttpTestExpectation<SuperTest.Test> {
    static className: string;
    protected status: any;
    constructor(status: number);
    getClassName(): string;
    injectExpectation(test: SuperTest.Test): SuperTest.Test;
}
