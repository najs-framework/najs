export declare type HttpTestExpectations<T> = Array<IHttpTestExpectation<T> | IHttpTestExpectation<T>[]>;
export interface IHttpTestExpectation<T> {
    /**
     * Inject expectation to supertest instance
     *
     * @param {T} test
     */
    injectExpectation(test: T): T;
}
