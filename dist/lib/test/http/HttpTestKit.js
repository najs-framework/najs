"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpExpectationEnum;
(function (HttpExpectationEnum) {
    HttpExpectationEnum[HttpExpectationEnum["Json"] = 0] = "Json";
    HttpExpectationEnum[HttpExpectationEnum["Status"] = 1] = "Status";
})(HttpExpectationEnum = exports.HttpExpectationEnum || (exports.HttpExpectationEnum = {}));
class HttpTestKit {
    constructor(testSuite) {
        this.testSuite = testSuite;
    }
    makeJsonExpectation(body) {
        return this.makeExpectation(HttpExpectationEnum.Json, [body]);
    }
    makeStatusExpectation(status) {
        return this.makeExpectation(HttpExpectationEnum.Status, [status]);
    }
    makeRequestAndSendData(method, url, data) {
        const test = this.makeRequest(method, url);
        if (data) {
            return test.send(data);
        }
        return test;
    }
}
exports.HttpTestKit = HttpTestKit;
