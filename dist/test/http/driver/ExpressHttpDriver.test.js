"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Http = require("http");
const NajsBinding = require("najs-binding");
const ExpressHttpDriver_1 = require("../../../lib/http/driver/ExpressHttpDriver");
const LogFacade_1 = require("../../../lib/facades/global/LogFacade");
const Controller_1 = require("../../../lib/http/controller/Controller");
const ExpressController_1 = require("../../../lib/http/controller/ExpressController");
const RouteMiddlewareUtil_1 = require("../../../lib/http/driver/private/RouteMiddlewareUtil");
describe('ExpressHttpDriver', function () {
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
        it('calls .createHandlersForRoute() to create initialize handlers for route', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            function handler() { }
            const route = {};
            const middlewareList = [];
            const createHandlersForRouteStub = Sinon.stub(driver, 'createHandlersForRoute');
            createHandlersForRouteStub.returns([handler]);
            const getMiddlewareListOfRouteStub = Sinon.stub(RouteMiddlewareUtil_1.RouteMiddlewareUtil, 'getMiddlewareListOfRoute');
            getMiddlewareListOfRouteStub.returns(middlewareList);
            const handlers = driver['getEndpointHandlers']('any', 'any', route);
            expect(handlers).toHaveLength(2);
            expect(handlers[0] === handler).toBe(true);
            expect(createHandlersForRouteStub.calledWith(route, middlewareList)).toBe(true);
            expect(getMiddlewareListOfRouteStub.calledWith(route)).toBe(true);
            getMiddlewareListOfRouteStub.restore();
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
    describe('protected .createHandlersForRoute()', function () {
        it('returns a list of "function" middleware if provided', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const a = () => { };
            expect(driver['createHandlersForRoute']({ middleware: [a] }, [])).toEqual([a]);
        });
        it('does not call RouteMiddlewareUtil.createNativeMiddlewareHandlers() if middleware list is empty', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const a = () => { };
            const createNativeMiddlewareHandlersStub = Sinon.stub(RouteMiddlewareUtil_1.RouteMiddlewareUtil, 'createNativeMiddlewareHandlers');
            createNativeMiddlewareHandlersStub.returns([]);
            expect(driver['createHandlersForRoute']({ middleware: [a] }, [])).toEqual([a]);
            expect(createNativeMiddlewareHandlersStub.called).toBe(false);
            createNativeMiddlewareHandlersStub.restore();
        });
        it('calls RouteMiddlewareUtil.createNativeMiddlewareHandlers() and do nothing if result is empty', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const a = () => { };
            const createNativeMiddlewareHandlersStub = Sinon.stub(RouteMiddlewareUtil_1.RouteMiddlewareUtil, 'createNativeMiddlewareHandlers');
            createNativeMiddlewareHandlersStub.returns([]);
            expect(driver['createHandlersForRoute']({ middleware: [a] }, [{}])).toEqual([a]);
            expect(createNativeMiddlewareHandlersStub.called).toBe(true);
            createNativeMiddlewareHandlersStub.restore();
        });
        it('joins result of RouteMiddlewareUtil.createNativeMiddlewareHandlers() if the result not empty', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const a = () => { };
            const b = () => { };
            const createNativeMiddlewareHandlersStub = Sinon.stub(RouteMiddlewareUtil_1.RouteMiddlewareUtil, 'createNativeMiddlewareHandlers');
            createNativeMiddlewareHandlersStub.returns([b]);
            expect(driver['createHandlersForRoute']({ middleware: [a] }, [{}])).toEqual([a, b]);
            expect(createNativeMiddlewareHandlersStub.called).toBe(true);
            createNativeMiddlewareHandlersStub.restore();
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
        NajsBinding.register(TestControllerA);
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
            const makeSpy = Sinon.spy(NajsBinding, 'make');
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
        it('creates instance of Controller via make, calls endpoint and calls handleEndpointResult()', async function () {
            const makeSpy = Sinon.spy(NajsBinding, 'make');
            const endpointSpy = Sinon.spy(TestControllerA.prototype, 'endpoint');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const handleEndpointResultStub = Sinon.stub(driver, 'handleEndpointResult');
            const result = driver['createEndpointWrapper']('TestControllerA', 'endpoint', []);
            const request = {};
            const response = {};
            await result(request, response);
            expect(makeSpy.calledWith('TestControllerA', [request, response])).toBe(true);
            expect(endpointSpy.called).toBe(true);
            expect(handleEndpointResultStub.calledWith(request, response, undefined)).toBe(true);
            expect(handleEndpointResultStub.lastCall.args[3]).toBeInstanceOf(Controller_1.Controller);
            expect(handleEndpointResultStub.lastCall.args[4]).toEqual([]);
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
            const makeSpy = Sinon.spy(NajsBinding, 'make');
            const controller = NajsBinding.make('TestControllerA');
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
            const makeSpy = Sinon.spy(NajsBinding, 'make');
            const controller = NajsBinding.make('TestControllerA');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const handleEndpointResultStub = Sinon.stub(driver, 'handleEndpointResult');
            const cloneControllerObjectSpy = Sinon.spy(driver, 'cloneControllerObject');
            const result = driver['createEndpointWrapperByObject'](controller, 'endpoint', []);
            const request = {};
            const response = {};
            await result(request, response);
            expect(cloneControllerObjectSpy.called).toBe(true);
            expect(makeSpy.calledWith('TestControllerA', [request, response])).toBe(true);
            expect(handleEndpointResultStub.calledWith(request, response, undefined)).toBe(true);
            expect(handleEndpointResultStub.lastCall.args[3]).toBeInstanceOf(Controller_1.Controller);
            expect(handleEndpointResultStub.lastCall.args[4]).toEqual([]);
            makeSpy.restore();
            cloneControllerObjectSpy.restore();
            handleEndpointResultStub.restore();
        });
        it('calls cloneControllerObject() with raw object but do not call if endpoint not found', function () {
            const controller = NajsBinding.make('TestControllerA');
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
            expect(handleEndpointResultStub.calledWith(request, response, undefined)).toBe(true);
            expect(typeof handleEndpointResultStub.lastCall.args[3] === 'object').toBe(true);
            expect(handleEndpointResultStub.lastCall.args[4]).toEqual([]);
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
        it('creates new Controller with request, response', async function () {
            await result(request, response);
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
            expect(handleEndpointResultStub.calledWith(request, response, undefined)).toBe(true);
            expect(handleEndpointResultStub.lastCall.args[3]).toBeInstanceOf(Controller_1.Controller);
            expect(handleEndpointResultStub.lastCall.args[4]).toEqual([]);
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
            driver['handleEndpointResult'](request, response, undefined, {}, []);
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
            await driver['handleEndpointResult'](request, response, promise, {}, []);
            expect(iResponseSpy.calledWith(request, response, driver)).toBe(true);
        });
        it('calls result.respond if result is IResponse', async function () {
            const iResponse = {
                respond(response, httpDriver) { }
            };
            const iResponseSpy = Sinon.spy(iResponse, 'respond');
            const request = {};
            const response = {};
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            await driver['handleEndpointResult'](request, response, iResponse, {}, []);
            expect(iResponseSpy.calledWith(request, response, driver)).toBe(true);
        });
    });
    describe('.setup()', function () {
        it('is called by constructor', function () {
            const setupSpy = Sinon.spy(ExpressHttpDriver_1.ExpressHttpDriver.prototype, 'setup');
            new ExpressHttpDriver_1.ExpressHttpDriver();
            expect(setupSpy.called).toBe(true);
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
        it('never creates server if options = { createServer: false } (helpful for testing)', function () {
            const fakeServer = {
                listen(port, host) { }
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const listenSpy = Sinon.spy(fakeServer, 'listen');
            const logStub = LogFacade_1.LogFacade.createStub('info');
            const httpStub = Sinon.stub(Http, 'createServer');
            httpStub.returns(fakeServer);
            driver.start({ createServer: false });
            expect(httpStub.calledWith(driver['express'])).toBe(false);
            expect(logStub.calledWith('Listening at localhost:3000')).toBe(false);
            expect(listenSpy.calledWith(3000, 'localhost')).toBe(false);
            listenSpy.restore();
            httpStub.restore();
            LogFacade_1.LogFacade.restoreFacade();
        });
        it('passes this.express to http.createServer() with default host=localhost, port=3000', function () {
            const fakeServer = {
                listen(port, host) { }
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const listenSpy = Sinon.spy(fakeServer, 'listen');
            const logStub = LogFacade_1.LogFacade.createStub('info');
            const httpStub = Sinon.stub(Http, 'createServer');
            httpStub.returns(fakeServer);
            driver.start();
            expect(httpStub.calledWith(driver['express'])).toBe(true);
            expect(logStub.calledWith('Listening at localhost:3000')).toBe(true);
            driver.start({ port: 3333 });
            expect(listenSpy.calledWith(3333, 'localhost')).toBe(true);
            expect(logStub.calledWith('Listening at localhost:3333')).toBe(true);
            driver.start({ host: '0.0.0.0' });
            expect(listenSpy.calledWith(3000, '0.0.0.0')).toBe(true);
            expect(logStub.calledWith('Listening at 0.0.0.0:3000')).toBe(true);
            driver.start({ port: 4444, host: '0.0.0.0' });
            expect(listenSpy.calledWith(4444, '0.0.0.0')).toBe(true);
            expect(logStub.calledWith('Listening at 0.0.0.0:4444')).toBe(true);
            listenSpy.restore();
            httpStub.restore();
            LogFacade_1.LogFacade.restoreFacade();
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
