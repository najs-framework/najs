"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./expectations/JsonExpectation");
require("./expectations/StatusExpectation");
const SuperTest = require("supertest");
const HttpTestKit_1 = require("../HttpTestKit");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../../constants");
class SupertestKit extends HttpTestKit_1.HttpTestKit {
    createSuperTest() {
        return SuperTest(this.testSuite['nativeHttpDriver']);
    }
    makeRequest(method, url) {
        return this.createSuperTest()[method.toLowerCase()](url);
    }
    makeJsonExpectation(body) {
        return najs_binding_1.make(constants_1.Najs.Test.Http.SuperTest.Expectation.JsonExpectation, [body]);
    }
    makeStatusExpectation(status) {
        return najs_binding_1.make(constants_1.Najs.Test.Http.SuperTest.Expectation.StatusExpectation, [status]);
    }
}
exports.SupertestKit = SupertestKit;
