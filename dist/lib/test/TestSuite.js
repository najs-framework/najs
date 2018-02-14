"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = require("./../facades/Facade");
class TestSuite {
    setUp() { }
    tearDown() {
        for (const container of Facade_1.FacadeContainers) {
            container.verifyMocks();
        }
        for (const container of Facade_1.FacadeContainers) {
            container.restoreFacades();
        }
    }
}
exports.TestSuite = TestSuite;
