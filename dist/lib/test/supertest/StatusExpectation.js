"use strict";
/// <reference types="najs-binding" />
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const najs_binding_1 = require("najs-binding");
class StatusExpectation {
    constructor(status) {
        this.status = status;
    }
    getClassName() {
        return constants_1.Najs.Test.SuperTestExpectation.StatusExpectation;
    }
    injectExpectation(test) {
        return test.expect(this.status);
    }
}
StatusExpectation.className = constants_1.Najs.Test.SuperTestExpectation.StatusExpectation;
exports.StatusExpectation = StatusExpectation;
najs_binding_1.register(StatusExpectation, constants_1.Najs.Test.SuperTestExpectation.StatusExpectation);
