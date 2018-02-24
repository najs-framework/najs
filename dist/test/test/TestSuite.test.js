"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_facade_1 = require("najs-facade");
const TestSuite_1 = require("../../lib/test/TestSuite");
describe('TestSuite', function () {
    describe('.setUp()', function () {
        it('is called before running test case', function () {
            const testSuite = new TestSuite_1.TestSuite();
            testSuite.setUp();
        });
    });
    describe('.tearDown()', function () {
        it('is called after running test case', function () { });
        it('calls verifyAndRestoreFacades() from FacadeContainer', function () {
            const verifyAndRestoreAllFacadesSpy = Sinon.spy(najs_facade_1.FacadeContainer, 'verifyAndRestoreAllFacades');
            const testSuite = new TestSuite_1.TestSuite();
            testSuite.tearDown();
            expect(verifyAndRestoreAllFacadesSpy.called).toBe(true);
        });
    });
});
