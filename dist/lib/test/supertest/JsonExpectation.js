"use strict";
/// <reference types="najs-binding" />
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const najs_binding_1 = require("najs-binding");
class JsonExpectation {
    constructor(body) {
        this.body = body;
    }
    getClassName() {
        return constants_1.Najs.Test.SuperTestExpectation.JsonExpectation;
    }
    injectExpectation(test) {
        test.expect('content-type', /application\/json/);
        if (typeof this.body !== 'undefined') {
            return test.expect((response) => {
                expect(response.body).toEqual(this.body);
            });
        }
        return test;
    }
}
JsonExpectation.className = constants_1.Najs.Test.SuperTestExpectation.JsonExpectation;
exports.JsonExpectation = JsonExpectation;
najs_binding_1.register(JsonExpectation, constants_1.Najs.Test.SuperTestExpectation.JsonExpectation);
