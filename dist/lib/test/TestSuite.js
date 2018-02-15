"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FacadeContainer_1 = require("./../facades/FacadeContainer");
class TestSuite {
    setUp() { }
    tearDown() {
        for (const container of FacadeContainer_1.FacadeContainersBag) {
            container.verifyMocks();
        }
        for (const container of FacadeContainer_1.FacadeContainersBag) {
            container.restoreFacades();
        }
        FacadeContainer_1.cleanFacadeContainersBag();
    }
}
exports.TestSuite = TestSuite;
