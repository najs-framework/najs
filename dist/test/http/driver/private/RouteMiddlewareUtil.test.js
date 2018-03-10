"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../../lib/http/HttpKernel");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../../../lib/constants");
const RouteMiddlewareUtil_1 = require("../../../../lib/http/driver/private/RouteMiddlewareUtil");
const isPromise_1 = require("../../../../lib/private/isPromise");
describe('RouteMiddlewareUtil', function () {
    describe('.getMiddlewareListOfRoute()', function () {
        it('filters out the all middleware which is a function', function () {
            const a = () => { };
            const b = () => { };
            const c = () => { };
            const middleware = [a, b, c];
            const httpKernel = najs_binding_1.make(constants_1.SystemClass.HttpKernel);
            expect(RouteMiddlewareUtil_1.RouteMiddlewareUtil.getMiddlewareListOfRoute({ middleware: middleware }, httpKernel)).toHaveLength(0);
        });
        it('calls protected .getMiddlewareList() for each value and flatten the result', function () {
            const httpKernel = najs_binding_1.make(constants_1.SystemClass.HttpKernel);
            const getMiddlewareStub = Sinon.stub(httpKernel, 'getMiddleware');
            getMiddlewareStub.withArgs('a').returns([1, 2, 3]);
            getMiddlewareStub.withArgs('b').returns([3, 4, 5]);
            const middleware = ['a', 'b'];
            expect(RouteMiddlewareUtil_1.RouteMiddlewareUtil.getMiddlewareListOfRoute({ middleware: middleware }, httpKernel)).toEqual([
                1,
                2,
                3,
                4,
                5
            ]);
        });
    });
    describe('.createNativeMiddlewareHandlers()', function () {
        it('filter out all middleware which has no .native()', function () {
            const driver = {};
            const middlewareNoNative = {};
            expect(RouteMiddlewareUtil_1.RouteMiddlewareUtil.createNativeMiddlewareHandlers([middlewareNoNative], driver)).toHaveLength(0);
        });
        it('skips if the .native() of middleware returns undefined', function () {
            const driver = {};
            const middlewareNative = {
                native() { }
            };
            const nativeSpy = Sinon.spy(middlewareNative, 'native');
            expect(RouteMiddlewareUtil_1.RouteMiddlewareUtil.createNativeMiddlewareHandlers([middlewareNative], driver)).toHaveLength(0);
            expect(nativeSpy.calledWith(driver)).toBe(true);
            expect(nativeSpy.lastCall.thisValue === middlewareNative).toBe(true);
        });
        it('returns an array if the native() return array of function or function', function () {
            const a = () => { };
            const b = () => { };
            const c = () => { };
            const driver = {};
            const middlewareNativeOne = {
                native() {
                    return a;
                }
            };
            const middlewareNativeTwo = {
                native() {
                    return [1, a, b, c];
                }
            };
            expect(RouteMiddlewareUtil_1.RouteMiddlewareUtil.createNativeMiddlewareHandlers([middlewareNativeOne, middlewareNativeTwo], driver)).toEqual([a, b, c]);
        });
    });
    describe('protected .getMiddlewareList()', function () {
        it('returns an empty array if middleware is not Object or String', function () {
            const httpKernel = najs_binding_1.make(constants_1.SystemClass.HttpKernel);
            expect(RouteMiddlewareUtil_1.RouteMiddlewareUtil['getMiddlewareList'](httpKernel, 12345)).toHaveLength(0);
            expect(RouteMiddlewareUtil_1.RouteMiddlewareUtil['getMiddlewareList'](httpKernel, true)).toHaveLength(0);
            expect(RouteMiddlewareUtil_1.RouteMiddlewareUtil['getMiddlewareList'](httpKernel, undefined)).toHaveLength(0);
        });
        it('returns an array wrap middleware if it is an Object', function () {
            const httpKernel = najs_binding_1.make(constants_1.SystemClass.HttpKernel);
            const middleware = {};
            const list = RouteMiddlewareUtil_1.RouteMiddlewareUtil['getMiddlewareList'](httpKernel, middleware);
            expect(list).toHaveLength(1);
            expect(list[0] === middleware).toBe(true);
        });
        it('calls HttpKernel.getMiddleware() if middleware is a string', function () {
            const httpKernel = najs_binding_1.make(constants_1.SystemClass.HttpKernel);
            const getMiddlewareStub = Sinon.stub(httpKernel, 'getMiddleware');
            getMiddlewareStub.returns([1, 2, 3]);
            const list = RouteMiddlewareUtil_1.RouteMiddlewareUtil['getMiddlewareList'](httpKernel, 'test');
            expect(list).toHaveLength(3);
            expect(getMiddlewareStub.calledWith('test')).toBe(true);
            getMiddlewareStub.restore();
        });
    });
    describe('.applyBeforeMiddleware()', function () {
        it('returns a promise', function () {
            expect(isPromise_1.isPromise(RouteMiddlewareUtil_1.RouteMiddlewareUtil.applyBeforeMiddleware([], {}, {}, {}))).toBe(true);
        });
        it('skipped if the middleware does not have .before() function', async function () {
            const hasBeforeMiddleware = {
                async before(request) { }
            };
            const hasNoBeforeMiddleware = {
                async after(request, response) { }
            };
            const beforeSpy = Sinon.spy(hasBeforeMiddleware, 'before');
            const afterSpy = Sinon.spy(hasNoBeforeMiddleware, 'after');
            const request = {};
            const response = {};
            const controller = {};
            await RouteMiddlewareUtil_1.RouteMiddlewareUtil.applyBeforeMiddleware([hasBeforeMiddleware, hasNoBeforeMiddleware], request, response, controller);
            expect(beforeSpy.calledWith(request, response, controller)).toBe(true);
            expect(beforeSpy.firstCall.thisValue === hasBeforeMiddleware).toBe(true);
            expect(afterSpy.called).toBe(false);
        });
    });
    describe('.applyAfterMiddleware()', function () {
        it('returns a promise', function () {
            expect(isPromise_1.isPromise(RouteMiddlewareUtil_1.RouteMiddlewareUtil.applyAfterMiddleware([], {}, {}, undefined, {}))).toBe(true);
        });
        it('returns value if middleware list is empty', async function () {
            const value = {};
            expect((await RouteMiddlewareUtil_1.RouteMiddlewareUtil.applyAfterMiddleware([], {}, {}, value, {})) === value).toBe(true);
        });
        it('skips if middleware has no .after() function, can receive new instance of result', async function () {
            const freshResult = {};
            const hasAfterMiddleware = {
                async after(request, response, result) {
                    return freshResult;
                }
            };
            const hasNoAfterMiddleware = {
                async before(request, response) { }
            };
            const afterSpy = Sinon.spy(hasAfterMiddleware, 'after');
            const beforeSpy = Sinon.spy(hasNoAfterMiddleware, 'before');
            const request = {};
            const response = {};
            const result = {};
            const received = await RouteMiddlewareUtil_1.RouteMiddlewareUtil.applyAfterMiddleware([hasAfterMiddleware, hasNoAfterMiddleware], request, response, result, {});
            expect(afterSpy.calledWith(request, response, result)).toBe(true);
            expect(afterSpy.firstCall.thisValue === hasAfterMiddleware).toBe(true);
            expect(beforeSpy.called).toBe(false);
            expect(received === freshResult).toBe(true);
        });
        it('skips if middleware has no .after() function, can receive same instance of result', async function () {
            const hasAfterMiddleware = {
                async after(request, response, result) {
                    return result;
                }
            };
            const request = {};
            const response = {};
            const result = {};
            const received = await RouteMiddlewareUtil_1.RouteMiddlewareUtil.applyAfterMiddleware([hasAfterMiddleware], request, response, result, {});
            expect(received === result).toBe(true);
        });
    });
});
