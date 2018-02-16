"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FacadeContainer_1 = require("./../facades/FacadeContainer");
class TestSuite {
    setUp() { }
    tearDown() {
        FacadeContainer_1.FacadeContainer.verifyAndRestoreAllFacades();
    }
}
exports.TestSuite = TestSuite;
