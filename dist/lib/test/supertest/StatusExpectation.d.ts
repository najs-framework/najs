import * as SuperTest from 'supertest';
import { ISuperTestExpectation } from './ISuperTestExpectation';
export declare class StatusExpectation implements Najs.Contracts.Autoload, ISuperTestExpectation {
    static className: string;
    protected status: any;
    constructor(status: number);
    getClassName(): string;
    injectExpectation(test: SuperTest.Test): SuperTest.Test;
}
