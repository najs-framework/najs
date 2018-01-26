"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Http = require("http");
const ExpressHttpDriver_1 = require("../../../lib/http/driver/ExpressHttpDriver");
const constants_1 = require("../../../lib/constants");
const ClassRegistry_1 = require("../../../lib/core/ClassRegistry");
const Log_1 = require("../../../lib/log/Log");
const Controller_1 = require("../../../lib/http/controller/Controller");
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
            const route = {
                method: 'GET',
                prefix: '/',
                path: 'path',
                middleware: []
            };
            driver.route(route);
            expect(getEndpointHandlersSpy.calledWith('get', '/path', route)).toBe(true);
            getEndpointHandlersSpy.restore();
        });
        it('does not pass handlers to this.express[method] if handler is empty', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const getEndpointHandlersStub = Sinon.stub(driver, 'getEndpointHandlers');
            getEndpointHandlersStub.returns([]);
            const postExpressStub = Sinon.stub(driver['express'], 'post');
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
        });
        it('passes handlers to this.express[method] with path and handler', function () {
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const fakeMiddleware = (a, b) => { };
            const fakeHandler = (a, b) => { };
            const getEndpointHandlersStub = Sinon.stub(driver, 'getEndpointHandlers');
            getEndpointHandlersStub.returns([fakeMiddleware, fakeHandler]);
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
    describe('protected .createEndpointWrapperByFunction()', function () {
        it('returns a wrapper function for endpoint, creates new Controller with request, response', function () {
            function handler() { }
            const handlerSpy = Sinon.spy(handler);
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const result = driver['createEndpointWrapperByFunction'](handlerSpy);
            expect(typeof result).toEqual('function');
            const request = {};
            const response = {};
            result(request, response);
            expect(handlerSpy.callCount).toEqual(1);
            const thisValue = handlerSpy.firstCall.thisValue;
            expect(thisValue).toBeInstanceOf(Controller_1.Controller);
            expect(thisValue.request === request).toBe(true);
            expect(thisValue.response === response).toBe(true);
            expect(handlerSpy.firstCall.args[0] === request).toBe(true);
            expect(handlerSpy.firstCall.args[1] === response).toBe(true);
        });
        it('calls result.respond if endpoint return IResponse', function () {
            const iResponse = {
                respond(response, httpDriver) { }
            };
            function handler() {
                return iResponse;
            }
            const iResponseSpy = Sinon.spy(iResponse, 'respond');
            const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
            const result = driver['createEndpointWrapperByFunction'](handler);
            const response = {};
            result({}, response);
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
