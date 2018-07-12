"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const JsonExpectation_1 = require("../../../lib/test/supertest/JsonExpectation");
describe('JsonExpectation', function () {
    it('implements IAutoload with name Najs.Test.SuperTestExpectation.JsonExpectation', function () {
        const jsonExpectation = new JsonExpectation_1.JsonExpectation();
        expect(jsonExpectation.getClassName()).toEqual('Najs.Test.SuperTestExpectation.JsonExpectation');
    });
    describe('constructor()', function () {
        it('can be init with/without body', function () {
            const instance1 = new JsonExpectation_1.JsonExpectation();
            expect(instance1['body']).toBeUndefined();
            const body = { test: 'abc' };
            const instance2 = new JsonExpectation_1.JsonExpectation(body);
            expect(instance2['body'] === body).toBe(true);
        });
    });
    describe('.injectExpectation()', function () {
        it('adds .expect(content-type, application/json) to test instance if there is no body', function () {
            const test = {
                expect() { }
            };
            const expectSpy = Sinon.spy(test, 'expect');
            const jsonExpectation = new JsonExpectation_1.JsonExpectation();
            jsonExpectation.injectExpectation(test);
            expect(expectSpy.calledOnce).toBe(true);
            expect(expectSpy.calledTwice).toBe(false);
        });
        it('adds .expect(content-type, application/json) and check body to test instance if has body', function () {
            const test = {
                expect() { }
            };
            const expectSpy = Sinon.spy(test, 'expect');
            const jsonExpectation = new JsonExpectation_1.JsonExpectation({});
            jsonExpectation.injectExpectation(test);
            expect(expectSpy.calledOnce).toBe(false);
            expect(expectSpy.calledTwice).toBe(true);
        });
    });
});
