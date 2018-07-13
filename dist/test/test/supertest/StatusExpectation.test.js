"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const StatusExpectation_1 = require("../../../lib/test/supertest/StatusExpectation");
describe('StatusExpectation', function () {
    it('implements IAutoload with name Najs.Test.SuperTestExpectation.StatusExpectation', function () {
        const jsonExpectation = new StatusExpectation_1.StatusExpectation(200);
        expect(jsonExpectation.getClassName()).toEqual('Najs.Test.SuperTestExpectation.StatusExpectation');
    });
    describe('constructor()', function () {
        it('can be init with status', function () {
            const instance1 = new StatusExpectation_1.StatusExpectation(400);
            expect(instance1['status']).toEqual(400);
        });
    });
    describe('.injectExpectation()', function () {
        it('adds .expect(content-type, application/json) to test instance if there is no body', function () {
            const test = {
                expect() { }
            };
            const expectSpy = Sinon.spy(test, 'expect');
            const jsonExpectation = new StatusExpectation_1.StatusExpectation(400);
            jsonExpectation.injectExpectation(test);
            expect(expectSpy.calledWith(400)).toBe(true);
        });
    });
});
