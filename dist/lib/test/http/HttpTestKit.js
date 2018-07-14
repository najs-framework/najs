"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class HttpTestKit {
    constructor(testSuite) {
        this.testSuite = testSuite;
    }
    makeRequestAndSendData(method, url, data) {
        const test = this.makeRequest(method, url);
        return typeof data === 'undefined' ? test : test.send(data);
    }
    applyExpectations(test, ...expectations) {
        const testExpectations = lodash_1.flatten(expectations);
        testExpectations.forEach((expectation) => {
            test = expectation.injectExpectation(test);
        });
    }
}
exports.HttpTestKit = HttpTestKit;
