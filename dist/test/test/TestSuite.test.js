"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const TestSuite_1 = require("../../lib/test/TestSuite");
describe('TestSuite', function () {
    describe('.setUp()', function () {
        it('is called before running test case', function () {
            const testSuite = new TestSuite_1.TestSuite();
            testSuite.setUp();
        });
    });
    describe('.tearDown()', function () {
        it('is called after running test case', function () {
            const testSuite = new TestSuite_1.TestSuite();
            testSuite.tearDown();
        });
    });
});
