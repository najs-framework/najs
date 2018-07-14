"use strict";
/// <reference types="najs-binding" />
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../../constants");
const najs_binding_1 = require("najs-binding");
class JsonExpectation {
    constructor(body) {
        this.body = body;
    }
    getClassName() {
        return constants_1.Najs.Test.Http.SuperTest.Expectation.JsonExpectation;
    }
    injectExpectation(test) {
        test.expect('content-type', /application\/json/);
        if (typeof this.body !== 'undefined') {
            return test.expect((response) => {
                // TODO: use assert instead of native expect() provided by jest
                expect(response.body).toEqual(this.body);
            });
        }
        return test;
    }
}
JsonExpectation.className = constants_1.Najs.Test.Http.SuperTest.Expectation.JsonExpectation;
exports.JsonExpectation = JsonExpectation;
najs_binding_1.register(JsonExpectation, constants_1.Najs.Test.Http.SuperTest.Expectation.JsonExpectation);
