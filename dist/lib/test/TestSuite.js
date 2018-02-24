"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
class TestSuite {
    setUp() { }
    tearDown() {
        najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
    }
}
exports.TestSuite = TestSuite;
