"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Express = require("express");
const Jest = require("../../lib/test/jest");
const najs_facade_1 = require("najs-facade");
const TestSuite_1 = require("../../lib/test/TestSuite");
const isPromise_1 = require("../../lib/private/isPromise");
const HttpMethod_1 = require("../../lib/http/HttpMethod");
describe('TestSuite', function () {
    describe('static .getFramework()', function () {
        it('simply returns TestSuite.najs framework instance if there is no params (getter)', function () {
            TestSuite_1.TestSuite['najs'] = 'anything';
            expect(TestSuite_1.TestSuite.getFramework()).toEqual('anything');
            TestSuite_1.TestSuite.clear();
        });
    });
    describe('static .setFramework()', function () {
        it('assigns the param to TestSuite.najs if there is an param, the startOptions is {createServer:false} by default', function () {
            const najs = {};
            expect(TestSuite_1.TestSuite.setFramework(najs) === najs).toBe(true);
            expect(TestSuite_1.TestSuite['startOptions']).toEqual({ createServer: false });
            TestSuite_1.TestSuite.clear();
        });
        it('assigns the param to TestSuite.najs if there is an param with custom startOptions', function () {
            const najs = {};
            expect(TestSuite_1.TestSuite.setFramework(najs, { createServer: true }) === najs).toBe(true);
            expect(TestSuite_1.TestSuite['startOptions']).toEqual({ createServer: true });
            TestSuite_1.TestSuite.clear();
        });
    });
    describe('static .clear()', function () {
        it('simply clears TestSuite.najs instance', function () {
            TestSuite_1.TestSuite['najs'] = 'anything';
            TestSuite_1.TestSuite.clear();
            expect(TestSuite_1.TestSuite['najs']).toBeUndefined();
        });
    });
    describe('static .runWithJest()', function () {
        it('calls .generateTestFromTestSuite() from jest and returns itself', function () {
            const generateTestFromTestSuiteStub = Sinon.stub(Jest, 'generateTestFromTestSuite');
            class Test extends TestSuite_1.TestSuite {
            }
            expect(TestSuite_1.TestSuite.runWithJest(Test) === TestSuite_1.TestSuite).toBe(true);
            expect(generateTestFromTestSuiteStub.calledWith(Test)).toBe(true);
            generateTestFromTestSuiteStub.restore();
        });
    });
    describe('static .jest()', function () {
        it('is an alias of .runWithJest()', function () {
            const runWithJestSpy = Sinon.spy(TestSuite_1.TestSuite, 'runWithJest');
            class Test extends TestSuite_1.TestSuite {
            }
            expect(TestSuite_1.TestSuite.jest(Test) === TestSuite_1.TestSuite).toBe(true);
            expect(runWithJestSpy.calledWith(Test)).toBe(true);
            runWithJestSpy.restore();
        });
    });
    describe('.setUp()', function () {
        it('does nothing and return undefined if the TestSuite.najs instance is undefined', function () {
            const testSuite = new TestSuite_1.TestSuite();
            expect(testSuite.setUp()).toBeUndefined();
        });
        it('does nothing and return undefined if the TestSuite.najs already started', function () {
            const najs = {
                isStarted() {
                    return true;
                }
            };
            TestSuite_1.TestSuite.setFramework(najs);
            const testSuite = new TestSuite_1.TestSuite();
            expect(testSuite.setUp()).toBeUndefined();
            TestSuite_1.TestSuite.clear();
        });
        it('returns an promise with call TestSuite.najs.started() and resolve the nativeHttpDriver to this.nativeHttpDriver', async function () {
            const najs = {
                isStarted() {
                    return false;
                },
                start() {
                    return new Promise(resolve => {
                        resolve('anything');
                    });
                },
                getNativeHttpDriver() {
                    return 'nativeHttpDriver';
                }
            };
            TestSuite_1.TestSuite.setFramework(najs);
            const testSuite = new TestSuite_1.TestSuite();
            const result = testSuite.setUp();
            expect(isPromise_1.isPromise(result)).toBe(true);
            await result;
            expect(testSuite['nativeHttpDriver']).toEqual('nativeHttpDriver');
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
    describe('protected .createSuperTest()', function () {
        it('uses SuperTest to create an SuperTest instance wrap this.nativeHttpDriver', function () {
            const testSuite = new TestSuite_1.TestSuite();
            testSuite['nativeHttpDriver'] = Express();
            const result = testSuite['createSuperTest']();
            for (const name in HttpMethod_1.HttpMethod) {
                const method = name === 'M_SEARCH' ? 'm-search' : name.toLowerCase();
                expect(typeof result[method]).toEqual('function');
            }
        });
    });
    describe('.call()', function () {
        it('calls .createSuperTest() to get the superTest instance then call [http-method] with url', function () {
            const testSuite = new TestSuite_1.TestSuite();
            const createSuperTestStub = Sinon.stub(testSuite, 'createSuperTest');
            const superTest = {
                get(url) {
                    return 'get' + url;
                },
                post(url) {
                    return 'post' + url;
                }
            };
            createSuperTestStub.returns(superTest);
            expect(testSuite.call('get', '/')).toEqual('get/');
            expect(testSuite.call('post', '/')).toEqual('post/');
        });
    });
    it('flattens the SuperTestExpectation from 3rd params and call .injectExpectation(test)', function () {
        const testSuite = new TestSuite_1.TestSuite();
        const createSuperTestStub = Sinon.stub(testSuite, 'createSuperTest');
        const superTest = {
            get(url) {
                return 'get' + url;
            }
        };
        const superTestExpectation = {
            injectExpectation(test) {
                return test;
            }
        };
        const injectExpectationSpy = Sinon.spy(superTestExpectation, 'injectExpectation');
        createSuperTestStub.returns(superTest);
        expect(testSuite.call('get', '/', superTestExpectation, superTestExpectation, superTestExpectation)).toEqual('get/');
        expect(injectExpectationSpy.callCount).toEqual(3);
    });
});
