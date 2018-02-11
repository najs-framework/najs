"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Http = require("http");
const Make = require("../../../lib/core/make");
const ExpressHttpDriver_1 = require("../../../lib/http/driver/ExpressHttpDriver");
const constants_1 = require("../../../lib/constants");
const ClassRegistry_1 = require("../../../lib/core/ClassRegistry");
const LogFacade_1 = require("../../../lib/facades/global/LogFacade");
const Controller_1 = require("../../../lib/http/controller/Controller");
const ExpressController_1 = require("../../../lib/http/controller/ExpressController");
const register_1 = require("../../../lib/core/register");
const isPromise_1 = require("../../../lib/private/isPromise");
describe('ExpressHttpDriver', function () {
    it('registers as default HttpDriver', function () {
        expect(ClassRegistry_1.ClassRegistry.has(constants_1.HttpDriverClass)).toBe(true);
        expect(ClassRegistry_1.ClassRegistry.findOrFail(constants_1.HttpDriverClass).instanceConstructor === ExpressHttpDriver_1.ExpressHttpDriver).toBe(true);
    });
    describe('static .setXPoweredByMiddleware()', function () {
        it('returns a middleware that sets X-Powered-By header', function () {
            const middleware = ExpressHttpDriver_1.ExpressHttpDriver.setXPoweredByMiddleware();
            expect(typeof middleware === 'function').toBe(true);
        });
        it('has default value is Najs/Express', function () {
            const response = {
                setHeader() { }
            };
            function next() { }
            const setHeaderStub = Sinon.stub(response, 'setHeader');
            const middleware = ExpressHttpDriver_1.ExpressHttpDriver.setXPoweredByMiddleware();
            middleware.call(undefined, {}, response, next);
            expect(setHeaderStub.calledWith('X-Powered-By', 'Najs/Express'));
        });
        it('can be used with custom name', function () {
            const response = {
                setHeader() { }
            };
            function next() { }
            const setHeaderStub = Sinon.stub(response, 'setHeader');
            const middleware = ExpressHttpDriver_1.ExpressHttpDriver.setXPoweredByMiddleware('Any name');
            middleware.call(undefined, {}, response, next);
            expect(setHeaderStub.calledWith('X-Powered-By', 'Any name'));
        });
    });
    describe('.getClassName()', function () {
        it('returns ExpressHttpDriver', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(driver.getClassName()).toEqual(ExpressHttpDriver_1.ExpressHttpDriver.className);
        });
    });
    describe('.getNativeDriver()', function () {
        it('returns Express app instance', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(driver.getNativeDriver() === driver['express']).toBe(true);
        });
    });
    describe('.route()', function () {
        it('skips if method is not supported', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const getEndpointHandlersSpy = Sinon.spy(driver, 'getEndpointHandlers');
            driver.route({
                method: 'get-not-found',
                prefix: '',
                path: '/path',
                middleware: []
            });
            expect(getEndpointHandlersSpy.called).toBe(false);
        });
        it('joins prefix and path, calls getEndpointHandlers() to get endpoint handler', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const getEndpointHandlersSpy = Sinon.spy(driver, 'getEndpointHandlers');
            const logStub = Sinon.stub(LogFacade_1.LogFacade, 'info');
            const route = {
                method: 'GET',
                prefix: '/',
                path: 'path',
                middleware: []
            };
            driver.route(route);
            expect(getEndpointHandlersSpy.calledWith('get', '/path', route)).toBe(true);
            getEndpointHandlersSpy.restore();
            logStub.restore();
        });
        it('does not pass handlers to this.express[method] if handler is empty', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const getEndpointHandlersStub = Sinon.stub(driver, 'getEndpointHandlers');
            getEndpointHandlersStub.returns([]);
            const postExpressStub = Sinon.stub(driver['express'], 'post');
            const logStub = Sinon.stub(LogFacade_1.LogFacade, 'info');
            const route = {
                method: 'POST',
                prefix: '/',
                path: 'path',
                middleware: []
            };
            driver.route(route);
            expect(postExpressStub.called).toBe(false);
            getEndpointHandlersStub.restore();
            postExpressStub.restore();
            logStub.restore();
        });
        it('passes handlers to this.express[method] with path and handler', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const fakeMiddleware = (a, b) => { };
            const fakeHandler = (a, b) => { };
            const getEndpointHandlersStub = Sinon.stub(driver, 'getEndpointHandlers');
            getEndpointHandlersStub.returns([fakeMiddleware, fakeHandler]);
            const logStub = Sinon.stub(LogFacade_1.LogFacade, 'info');
            const postExpressStub = Sinon.stub(driver['express'], 'post');
            const route = {
                method: 'POST',
                prefix: '/',
                path: 'path',
                middleware: []
            };
            driver.route(route);
            expect(postExpressStub.calledWith('/path', fakeMiddleware, fakeHandler)).toBe(true);
            getEndpointHandlersStub.restore();
            postExpressStub.restore();
            logStub.restore();
        });
    });
    describe('protected .getEndpointHandlers()', function () {
        it('pushes middleware to handlers if middleware is a function', function () {
            function handler() { }
            function middleware() { }
            const route = {
                middleware: ['something', middleware],
                endpoint: handler
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const handlers = driver['getEndpointHandlers']('any', 'any', route);
            expect(handlers).toHaveLength(2);
            expect(handlers[0] === middleware).toBe(true);
        });
        it('creates middlewareList and calls createNativeMiddlewareWrapper(), createBeforeMiddlewareWrapper() if the list not empty', function () {
            function handler() { }
            const middleware = {};
            const route = {
                middleware: ['something'],
                endpoint: handler
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const getMiddlewareStub = Sinon.stub(driver['httpKernel'], 'getMiddleware');
            // no worries, it remove duplicated middleware
            getMiddlewareStub.returns([middleware, middleware, middleware, middleware]);
            const createNativeMiddlewareWrapperSpy = Sinon.spy(driver, 'createNativeMiddlewareWrapper');
            const createBeforeMiddlewareWrapperSpy = Sinon.spy(driver, 'createBeforeMiddlewareWrapper');
            const handlers = driver['getEndpointHandlers']('any', 'any', route);
            expect(handlers).toHaveLength(2);
            expect(createNativeMiddlewareWrapperSpy.calledWith([middleware])).toBe(true);
            expect(createBeforeMiddlewareWrapperSpy.calledWith([middleware])).toBe(true);
            getMiddlewareStub.restore();
        });
        it('calls createEndpointWrapperByFunction and pushes result to handlers', function () {
            function handler() { }
            const route = {
                middleware: [],
                endpoint: handler
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const createEndpointWrapperByFunctionStub = Sinon.stub(driver, 'createEndpointWrapperByFunction');
            const handlers = driver['getEndpointHandlers']('any', 'any', route);
            expect(handlers).toHaveLength(1);
            expect(createEndpointWrapperByFunctionStub.calledWith(handler)).toBe(true);
            createEndpointWrapperByFunctionStub.restore();
        });
        it('calls createEndpointWrapper and pushes result to handlers if controller is string', function () {
            const route = {
                middleware: [],
                controller: 'Test',
                endpoint: 'endpoint'
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const createEndpointWrapperStub = Sinon.stub(driver, 'createEndpointWrapper');
            const handlers = driver['getEndpointHandlers']('any', 'any', route);
            expect(handlers).toHaveLength(1);
            expect(createEndpointWrapperStub.calledWith('Test', 'endpoint')).toBe(true);
            createEndpointWrapperStub.restore();
        });
        it('calls createEndpointWrapper and pushes result to handlers if controller is Function', function () {
            const classDefinition = () => { };
            const route = {
                middleware: [],
                controller: classDefinition,
                endpoint: 'endpoint'
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const createEndpointWrapperStub = Sinon.stub(driver, 'createEndpointWrapper');
            const handlers = driver['getEndpointHandlers']('any', 'any', route);
            expect(handlers).toHaveLength(1);
            expect(createEndpointWrapperStub.calledWith(classDefinition, 'endpoint')).toBe(true);
            createEndpointWrapperStub.restore();
        });
        it('calls createEndpointWrapperByObject and pushes result to handlers if controller is Object', function () {
            const controllerObject = {};
            const route = {
                middleware: [],
                controller: controllerObject,
                endpoint: 'endpoint'
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const createEndpointWrapperByObjectStub = Sinon.stub(driver, 'createEndpointWrapperByObject');
            const handlers = driver['getEndpointHandlers']('any', 'any', route);
            expect(handlers).toHaveLength(1);
            expect(createEndpointWrapperByObjectStub.calledWith(controllerObject, 'endpoint')).toBe(true);
            createEndpointWrapperByObjectStub.restore();
        });
    });
    describe('protected .getMiddlewareList()', function () {
        it('returns an empty array if middleware is not Object or String', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(driver['getMiddlewareList'](12345)).toHaveLength(0);
            expect(driver['getMiddlewareList'](true)).toHaveLength(0);
            expect(driver['getMiddlewareList'](undefined)).toHaveLength(0);
        });
        it('returns an array wrap middleware if it is an Object', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const middleware = {};
            const list = driver['getMiddlewareList'](middleware);
            expect(list).toHaveLength(1);
            expect(list[0] === middleware).toBe(true);
        });
        it('calls HttpKernel.getMiddleware() if middleware is a string', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const getMiddlewareStub = Sinon.stub(driver['httpKernel'], 'getMiddleware');
            getMiddlewareStub.returns([1, 2, 3]);
            const list = driver['getMiddlewareList']('test');
            expect(list).toHaveLength(3);
            expect(getMiddlewareStub.calledWith('test')).toBe(true);
            getMiddlewareStub.restore();
        });
    });
    describe('protected .createBeforeMiddlewareWrapper()', function () {
        it('returns an async function', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(typeof driver['createBeforeMiddlewareWrapper']([]) === 'function').toBe(true);
        });
        it('skipped if the middleware does not have .before() function', async function () {
            const hasBeforeMiddleware = {
                async before(request) { }
            };
            const hasNoBeforeMiddleware = {
                async after(request, response) { }
            };
            const next = function () { };
            const beforeSpy = Sinon.spy(hasBeforeMiddleware, 'before');
            const afterSpy = Sinon.spy(hasNoBeforeMiddleware, 'after');
            const nextSpy = Sinon.spy(next);
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const wrapper = driver['createBeforeMiddlewareWrapper']([hasBeforeMiddleware, hasNoBeforeMiddleware]);
            const request = {};
            const response = {};
            await wrapper(request, response, nextSpy);
            expect(beforeSpy.calledWith(request, response)).toBe(true);
            expect(beforeSpy.firstCall.thisValue === hasBeforeMiddleware).toBe(true);
            expect(afterSpy.called).toBe(false);
            expect(nextSpy.called).toBe(true);
        });
        it('calls next() with error if there is any error in middleware', async function () {
            const error = new Error();
            const beforeOneMiddleware = {
                async before(request) {
                    throw error;
                }
            };
            const beforeTwoMiddleware = {
                async before(request) { }
            };
            const next = function () { };
            const beforeOneSpy = Sinon.spy(beforeOneMiddleware, 'before');
            const beforeTwoSpy = Sinon.spy(beforeTwoMiddleware, 'before');
            const nextSpy = Sinon.spy(next);
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const wrapper = driver['createBeforeMiddlewareWrapper']([beforeOneMiddleware, beforeTwoMiddleware]);
            const request = {};
            const response = {};
            await wrapper(request, response, nextSpy);
            expect(beforeOneSpy.calledWith(request, response)).toBe(true);
            expect(beforeOneSpy.firstCall.thisValue === beforeOneMiddleware).toBe(true);
            expect(beforeTwoSpy.called).toBe(false);
            expect(nextSpy.calledWith(error)).toBe(true);
        });
    });
    describe('protected .createNativeMiddlewareWrapper()', function () {
        it('returns undefined', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(typeof driver['createNativeMiddlewareWrapper']([]) === 'undefined').toBe(true);
        });
        it('skipped if the middleware does not have .native() function', async function () {
            const hasNativeMiddleware = {
                native(httpDriver) { }
            };
            const hasNoNativeMiddleware = {
                async after(request, response) { }
            };
            const nativeSpy = Sinon.spy(hasNativeMiddleware, 'native');
            const afterSpy = Sinon.spy(hasNoNativeMiddleware, 'after');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            driver['createNativeMiddlewareWrapper']([hasNativeMiddleware, hasNoNativeMiddleware]);
            expect(nativeSpy.calledWith(driver)).toBe(true);
            expect(nativeSpy.firstCall.thisValue === hasNativeMiddleware).toBe(true);
            expect(afterSpy.called).toBe(false);
        });
    });
    describe('protected .createEndpointWrapper()', function () {
        class TestControllerA extends Controller_1.Controller {
            getClassName() {
                return TestControllerA.className;
            }
            endpoint() { }
        }
        TestControllerA.className = 'TestControllerA';
        register_1.register(TestControllerA);
        it('always returns a function despite Controller or Endpoint are invalid', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const result = driver['createEndpointWrapper']('NotFound', 'invalid', []);
            expect(typeof result === 'function').toBe(true);
        });
        it('calls make() and make() throws an error if Controller not found', async function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const result = driver['createEndpointWrapper']('NotFound', 'invalid', []);
            expect(typeof result === 'function').toBe(true);
            try {
                await result({}, {});
            }
            catch (error) {
                expect(error).toBeInstanceOf(ReferenceError);
                return;
            }
            expect('shout not reach this line').toEqual('hum');
        });
        it('creates instance of Controller via make but do not call if endpoint not found', function () {
            const makeSpy = Sinon.spy(Make, 'make');
            const endpointSpy = Sinon.spy(TestControllerA.prototype, 'endpoint');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const result = driver['createEndpointWrapper']('TestControllerA', 'invalid', []);
            const request = {};
            const response = {};
            result(request, response);
            expect(makeSpy.calledWith('TestControllerA', [request, response])).toBe(true);
            expect(endpointSpy.called).toBe(false);
            makeSpy.restore();
            endpointSpy.restore();
        });
        it('creates instance of Controller via make, calls endpoint and calls handleEndpointResult()', function () {
            const makeSpy = Sinon.spy(Make, 'make');
            const endpointSpy = Sinon.spy(TestControllerA.prototype, 'endpoint');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const handleEndpointResultStub = Sinon.stub(driver, 'handleEndpointResult');
            const result = driver['createEndpointWrapper']('TestControllerA', 'endpoint', []);
            const request = {};
            const response = {};
            result(request, response);
            expect(makeSpy.calledWith('TestControllerA', [request, response])).toBe(true);
            expect(endpointSpy.called).toBe(true);
            expect(handleEndpointResultStub.calledWith(request, response, undefined, [])).toBe(true);
            makeSpy.restore();
            endpointSpy.restore();
            handleEndpointResultStub.restore();
        });
    });
    describe('protected .createEndpointWrapperByObject()', function () {
        it('always returns a function despite Controller or Endpoint are invalid', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const result = driver['createEndpointWrapperByObject']({}, 'invalid', []);
            expect(typeof result === 'function').toBe(true);
        });
        it('calls cloneControllerObject()/make() with controller instance but do not call if endpoint not found', function () {
            const makeSpy = Sinon.spy(Make, 'make');
            const controller = Make.make('TestControllerA');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const cloneControllerObjectSpy = Sinon.spy(driver, 'cloneControllerObject');
            const result = driver['createEndpointWrapperByObject'](controller, 'invalid', []);
            const request = {};
            const response = {};
            result(request, response);
            expect(makeSpy.calledWith('TestControllerA', [request, response])).toBe(true);
            expect(cloneControllerObjectSpy.called).toBe(true);
            makeSpy.restore();
            cloneControllerObjectSpy.restore();
        });
        it('calls cloneControllerObject()/make() with controller instance, calls endpoint and calls handleEndpointResult()', async function () {
            const makeSpy = Sinon.spy(Make, 'make');
            const controller = Make.make('TestControllerA');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const handleEndpointResultStub = Sinon.stub(driver, 'handleEndpointResult');
            const cloneControllerObjectSpy = Sinon.spy(driver, 'cloneControllerObject');
            const result = driver['createEndpointWrapperByObject'](controller, 'endpoint', []);
            const request = {};
            const response = {};
            result(request, response);
            expect(cloneControllerObjectSpy.called).toBe(true);
            expect(makeSpy.calledWith('TestControllerA', [request, response])).toBe(true);
            expect(handleEndpointResultStub.calledWith(request, response, undefined, [])).toBe(true);
            makeSpy.restore();
            cloneControllerObjectSpy.restore();
            handleEndpointResultStub.restore();
        });
        it('calls cloneControllerObject() with raw object but do not call if endpoint not found', function () {
            const controller = Make.make('TestControllerA');
            const endpointSpy = Sinon.spy(controller, 'endpoint');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const cloneControllerObjectSpy = Sinon.spy(driver, 'cloneControllerObject');
            const result = driver['createEndpointWrapperByObject'](controller, 'invalid', []);
            const request = {};
            const response = {};
            result(request, response);
            expect(cloneControllerObjectSpy.called).toBe(true);
            expect(endpointSpy.called).toBe(false);
            cloneControllerObjectSpy.restore();
            endpointSpy.restore();
        });
        it('calls cloneControllerObject() with raw object, calls endpoint and calls handleEndpointResult()', async function () {
            const controller = {
                endpoint() { }
            };
            const endpointSpy = Sinon.spy(controller, 'endpoint');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const handleEndpointResultStub = Sinon.stub(driver, 'handleEndpointResult');
            const cloneControllerObjectSpy = Sinon.spy(driver, 'cloneControllerObject');
            const result = driver['createEndpointWrapperByObject'](controller, 'endpoint', []);
            const request = {};
            const response = {};
            await result(request, response);
            expect(cloneControllerObjectSpy.called).toBe(true);
            expect(endpointSpy.called).toBe(true);
            expect(handleEndpointResultStub.calledWith(request, response, undefined, [])).toBe(true);
            cloneControllerObjectSpy.restore();
            endpointSpy.restore();
            handleEndpointResultStub.restore();
        });
    });
    describe('protected .createEndpointWrapperByFunction()', function () {
        function handler() { }
        const handlerSpy = Sinon.spy(handler);
        const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
        const result = driver['createEndpointWrapperByFunction'](handlerSpy, []);
        const handleEndpointResultStub = Sinon.stub(driver, 'handleEndpointResult');
        const request = { method: 'GET' };
        const response = {};
        it('returns a wrapper function for endpoint', function () {
            expect(typeof result).toEqual('function');
        });
        it('creates new Controller with request, response', function () {
            result(request, response);
            expect(handlerSpy.callCount).toEqual(1);
            const thisValue = handlerSpy.firstCall.thisValue;
            expect(thisValue).toBeInstanceOf(Controller_1.Controller);
            expect(thisValue).toBeInstanceOf(ExpressController_1.ExpressController);
            expect(thisValue.request === request).toBe(true);
            expect(thisValue.response === response).toBe(true);
        });
        it("calls handleEndpointResult and passes response, endpoint's result", function () {
            expect(handlerSpy.firstCall.args[0] === request).toBe(true);
            expect(handlerSpy.firstCall.args[1] === response).toBe(true);
            expect(handleEndpointResultStub.calledWith(request, response, undefined, [])).toBe(true);
            handleEndpointResultStub.restore();
        });
    });
    describe('protected .cloneControllerObject()', function () {
        it('clones controller object by Object.assign with request, response', function () {
            const request = {};
            const response = {};
            const origin = { prop: 'anything', endpoint() { } };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const clone = driver['cloneControllerObject'](origin, request, response);
            expect(clone === origin).toBe(false);
            expect(clone['prop']).toEqual('anything');
            expect(clone['endpoint'] === origin.endpoint).toBe(true);
            expect(clone['request'] === request).toBe(true);
            expect(clone['response'] === response).toBe(true);
        });
        it('does not do deep clone', function () {
            const request = {};
            const response = {};
            const ref = {};
            const origin = { ref, prop: 'anything', endpoint() { } };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const clone = driver['cloneControllerObject'](origin, request, response);
            expect(clone['ref'] === origin.ref).toBe(true);
        });
    });
    describe('protected .handleEndpointResult()', function () {
        it('does nothing if result is undefined', function () {
            const request = {};
            const response = {};
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            driver['handleEndpointResult'](request, response, undefined, []);
        });
        it('calls await if result is a Promise like', async function () {
            const iResponse = {
                respond(response, httpDriver) { }
            };
            const iResponseSpy = Sinon.spy(iResponse, 'respond');
            const promise = new Promise(function (resolve) {
                resolve(iResponse);
            });
            const request = {};
            const response = {};
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            await driver['handleEndpointResult'](request, response, promise, []);
            expect(iResponseSpy.calledWith(response, driver)).toBe(true);
        });
        it('calls result.respond if result is IResponse', async function () {
            const iResponse = {
                respond(response, httpDriver) { }
            };
            const iResponseSpy = Sinon.spy(iResponse, 'respond');
            const request = {};
            const response = {};
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            await driver['handleEndpointResult'](request, response, iResponse, []);
            expect(iResponseSpy.calledWith(response, driver)).toBe(true);
        });
    });
    describe('protected .applyAfterMiddlewareWrapper()', function () {
        it('returns a promise', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(isPromise_1.isPromise(driver['applyAfterMiddlewareWrapper']([], {}, {}, undefined))).toBe(true);
        });
        it('returns value if middleware list is empty', async function () {
            const value = {};
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect((await driver['applyAfterMiddlewareWrapper']([], {}, {}, value)) === value).toBe(true);
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
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const received = await driver['applyAfterMiddlewareWrapper']([hasAfterMiddleware, hasNoAfterMiddleware], request, response, result);
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
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const received = await driver['applyAfterMiddlewareWrapper']([hasAfterMiddleware], request, response, result);
            expect(received === result).toBe(true);
        });
    });
    describe('.setup()', function () {
        it('is called by constructor', function () {
            const setupSpy = Sinon.spy(ExpressHttpDriver_1.ExpressHttpDriver.prototype, 'setup');
            new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(setupSpy.called).toBe(true);
        });
        it('calls .setupBodyParser()', function () {
            const setupBodyParser = Sinon.spy(ExpressHttpDriver_1.ExpressHttpDriver.prototype, 'setupBodyParser');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(setupBodyParser.calledWith(driver['express'])).toBe(true);
        });
        it('calls .setupCookieParser()', function () {
            const setupCookieParser = Sinon.spy(ExpressHttpDriver_1.ExpressHttpDriver.prototype, 'setupCookieParser');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(setupCookieParser.calledWith(driver['express'])).toBe(true);
        });
        it('calls .setupViewEngine() for setting up the view engine', function () {
            const setupViewEngine = Sinon.spy(ExpressHttpDriver_1.ExpressHttpDriver.prototype, 'setupViewEngine');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(setupViewEngine.calledWith(driver['express'])).toBe(true);
        });
        it('calls .setupStaticAssets() for setting up the view engine', function () {
            const setupStaticAssets = Sinon.spy(ExpressHttpDriver_1.ExpressHttpDriver.prototype, 'setupStaticAssets');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(setupStaticAssets.calledWith(driver['express'])).toBe(true);
        });
    });
    describe('.start()', function () {
        it('passes this.express to http.createServer()', function () {
            const fakeServer = {
                listen(port, host) { }
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const listenSpy = Sinon.spy(fakeServer, 'listen');
            const logStub = Sinon.stub(LogFacade_1.LogFacade, 'info');
            const httpStub = Sinon.stub(Http, 'createServer');
            httpStub.returns(fakeServer);
            driver.start({});
            expect(httpStub.calledWith(driver['express'])).toBe(true);
            expect(logStub.calledWith('Listening at port 3000')).toBe(true);
            driver.start({ port: 3333 });
            expect(listenSpy.calledWith(3333, undefined)).toBe(true);
            expect(logStub.calledWith('Listening at port 3333')).toBe(true);
            driver.start({ host: '0.0.0.0' });
            expect(listenSpy.calledWith(undefined, '0.0.0.0')).toBe(true);
            expect(logStub.calledWith('Listening at port 0.0.0.0:3000')).toBe(true);
            driver.start({ port: 4444, host: '0.0.0.0' });
            expect(listenSpy.calledWith(4444, '0.0.0.0')).toBe(true);
            expect(logStub.calledWith('Listening at port 0.0.0.0:4444')).toBe(true);
            httpStub.restore();
            logStub.restore();
        });
    });
    describe('.respondView()', function () {
        it('calls response.render()', function () {
            const response = {
                render: function () { }
            };
            const renderSpy = Sinon.spy(response, 'render');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const variables = { any: 'thing' };
            driver.respondView(response, 'test', variables);
            expect(renderSpy.calledWith('test', variables)).toBe(true);
        });
    });
    describe('.responseJson()', function () {
        it('calls response.json()', function () {
            const response = {
                json: function () { }
            };
            const jsonSpy = Sinon.spy(response, 'json');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            driver.respondJson(response, 123);
            expect(jsonSpy.calledWith(123)).toBe(true);
            driver.respondJson(response, '123');
            expect(jsonSpy.calledWith('123')).toBe(true);
            driver.respondJson(response, [1, 2, 3]);
            expect(jsonSpy.calledWith([1, 2, 3])).toBe(true);
            driver.respondJson(response, { any: 'thing' });
            expect(jsonSpy.calledWith({ any: 'thing' })).toBe(true);
        });
    });
    describe('.responseJsonp()', function () {
        it('calls response.jsonp()', function () {
            const response = {
                jsonp: function () { }
            };
            const jsonpSpy = Sinon.spy(response, 'jsonp');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            driver.respondJsonp(response, 123);
            expect(jsonpSpy.calledWith(123)).toBe(true);
            driver.respondJsonp(response, '123');
            expect(jsonpSpy.calledWith('123')).toBe(true);
            driver.respondJsonp(response, [1, 2, 3]);
            expect(jsonpSpy.calledWith([1, 2, 3])).toBe(true);
            driver.respondJsonp(response, { any: 'thing' });
            expect(jsonpSpy.calledWith({ any: 'thing' })).toBe(true);
        });
    });
    describe('.responseRedirect()', function () {
        it('calls response.redirect() with swapped params', function () {
            const response = {
                redirect: function () { }
            };
            const redirectSpy = Sinon.spy(response, 'redirect');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            driver.respondRedirect(response, 'test', 304);
            expect(redirectSpy.calledWith(304, 'test')).toBe(true);
        });
    });
});
