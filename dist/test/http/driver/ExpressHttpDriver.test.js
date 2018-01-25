"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ExpressHttpDriver_1 = require("../../../lib/http/driver/ExpressHttpDriver");
const constants_1 = require("../../../lib/constants");
const ClassRegistry_1 = require("../../../lib/core/ClassRegistry");
const Log_1 = require("../../../lib/log/Log");
const Http = require("http");
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
        // TODO: write unit test
        const driver = new ExpressHttpDriver_1.ExpressHttpDriver();
        driver.route({});
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
