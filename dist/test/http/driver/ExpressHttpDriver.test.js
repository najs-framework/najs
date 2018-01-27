"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Http = require("http");
const Make = require("../../../lib/core/make");
const ExpressHttpDriver_1 = require("../../../lib/http/driver/ExpressHttpDriver");
const constants_1 = require("../../../lib/constants");
const ClassRegistry_1 = require("../../../lib/core/ClassRegistry");
const Log_1 = require("../../../lib/log/Log");
const Controller_1 = require("../../../lib/http/controller/Controller");
const register_1 = require("../../../lib/core/register");
describe('ExpressHttpDriver', function () {
    it('registers as default HttpDriver', function () {
        expect(ClassRegistry_1.ClassRegistry.has(constants_1.HttpDriverClass)).toBe(true);
        expect(ClassRegistry_1.ClassRegistry.findOrFail(constants_1.HttpDriverClass).instanceConstructor === ExpressHttpDriver_1.ExpressHttpDriver).toBe(true);
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
            const logStub = Sinon.stub(Log_1.Log, 'info');
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
            const logStub = Sinon.stub(Log_1.Log, 'info');
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
            const logStub = Sinon.stub(Log_1.Log, 'info');
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
        it('calls createEndpointWrapperByFunction and pushes result to handlers', function () {
            function handler() { }
            const route = {
                endpoint: handler
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const createEndpointWrapperByFunctionStub = Sinon.stub(driver, 'createEndpointWrapperByFunction');
            const handlers = driver['getEndpointHandlers']('any', 'any', route);
            expect(handlers).toHaveLength(1);
            expect(createEndpointWrapperByFunctionStub.calledWith(handler)).toBe(true);
            createEndpointWrapperByFunctionStub.restore();
        });
        // TODO: write more test
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
            const result = driver['createEndpointWrapper']('NotFound', 'invalid');
            expect(typeof result === 'function').toBe(true);
        });
        it('calls make() and make() throws an error if Controller not found', async function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const result = driver['createEndpointWrapper']('NotFound', 'invalid');
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
            const result = driver['createEndpointWrapper']('TestControllerA', 'invalid');
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
            const result = driver['createEndpointWrapper']('TestControllerA', 'endpoint');
            const request = {};
            const response = {};
            result(request, response);
            expect(makeSpy.calledWith('TestControllerA', [request, response])).toBe(true);
            expect(endpointSpy.called).toBe(true);
            expect(handleEndpointResultStub.calledWith(response, undefined)).toBe(true);
            makeSpy.restore();
            endpointSpy.restore();
            handleEndpointResultStub.restore();
        });
    });
    describe('protected .createEndpointWrapperByObject()', function () {
        it('always returns a function despite Controller or Endpoint are invalid', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const result = driver['createEndpointWrapperByObject']({}, 'invalid');
            expect(typeof result === 'function').toBe(true);
        });
        it('calls cloneControllerObject()/make() with controller instance but do not call if endpoint not found', function () {
            const makeSpy = Sinon.spy(Make, 'make');
            const controller = Make.make('TestControllerA');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const cloneControllerObjectSpy = Sinon.spy(driver, 'cloneControllerObject');
            const result = driver['createEndpointWrapperByObject'](controller, 'invalid');
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
            const result = driver['createEndpointWrapperByObject'](controller, 'endpoint');
            const request = {};
            const response = {};
            result(request, response);
            expect(cloneControllerObjectSpy.called).toBe(true);
            expect(makeSpy.calledWith('TestControllerA', [request, response])).toBe(true);
            expect(handleEndpointResultStub.calledWith(response, undefined)).toBe(true);
            makeSpy.restore();
            cloneControllerObjectSpy.restore();
            handleEndpointResultStub.restore();
        });
        it('calls cloneControllerObject() with raw object but do not call if endpoint not found', function () {
            const controller = Make.make('TestControllerA');
            const endpointSpy = Sinon.spy(controller, 'endpoint');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const cloneControllerObjectSpy = Sinon.spy(driver, 'cloneControllerObject');
            const result = driver['createEndpointWrapperByObject'](controller, 'invalid');
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
            const result = driver['createEndpointWrapperByObject'](controller, 'endpoint');
            const request = {};
            const response = {};
            await result(request, response);
            expect(cloneControllerObjectSpy.called).toBe(true);
            expect(endpointSpy.called).toBe(true);
            expect(handleEndpointResultStub.calledWith(response, undefined)).toBe(true);
            cloneControllerObjectSpy.restore();
            endpointSpy.restore();
            handleEndpointResultStub.restore();
        });
    });
    describe('protected .createEndpointWrapperByFunction()', function () {
        function handler() { }
        const handlerSpy = Sinon.spy(handler);
        const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
        const result = driver['createEndpointWrapperByFunction'](handlerSpy);
        const handleEndpointResultStub = Sinon.stub(driver, 'handleEndpointResult');
        const request = {};
        const response = {};
        it('returns a wrapper function for endpoint', function () {
            expect(typeof result).toEqual('function');
        });
        it('creates new Controller with request, response', function () {
            result(request, response);
            expect(handlerSpy.callCount).toEqual(1);
            const thisValue = handlerSpy.firstCall.thisValue;
            expect(thisValue).toBeInstanceOf(Controller_1.Controller);
            expect(thisValue.request === request).toBe(true);
            expect(thisValue.response === response).toBe(true);
        });
        it("calls handleEndpointResult and passes response, endpoint's result", function () {
            expect(handlerSpy.firstCall.args[0] === request).toBe(true);
            expect(handlerSpy.firstCall.args[1] === response).toBe(true);
            expect(handleEndpointResultStub.calledWith(response, undefined)).toBe(true);
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
            const response = {};
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            driver['handleEndpointResult'](response, undefined);
        });
        it('calls await if result is a Promise like', async function () {
            const iResponse = {
                respond(response, httpDriver) { }
            };
            const iResponseSpy = Sinon.spy(iResponse, 'respond');
            const promise = new Promise(function (resolve) {
                resolve(iResponse);
            });
            const response = {};
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            await driver['handleEndpointResult'](response, promise);
            expect(iResponseSpy.calledWith(response, driver)).toBe(true);
        });
        it('calls result.respond if result is IResponse', function () {
            const iResponse = {
                respond(response, httpDriver) { }
            };
            const iResponseSpy = Sinon.spy(iResponse, 'respond');
            const response = {};
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            driver['handleEndpointResult'](response, iResponse);
            expect(iResponseSpy.calledWith(response, driver)).toBe(true);
        });
    });
    describe('.start()', function () {
        it('passes this.express to http.createServer()', function () {
            const fakeServer = {
                listen(port, host) { }
            };
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const listenSpy = Sinon.spy(fakeServer, 'listen');
            const logStub = Sinon.stub(Log_1.Log, 'info');
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
    describe('.responseJson()', function () {
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
