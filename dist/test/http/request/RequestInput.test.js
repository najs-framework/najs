"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Controller_1 = require("../../../lib/http/controller/Controller");
const ExpressController_1 = require("../../../lib/http/controller/ExpressController");
const RequestData_1 = require("../../../lib/http/request/RequestData");
const RequestInput_1 = require("../../../lib/http/request/RequestInput");
const constants_1 = require("../../../lib/constants");
describe('ExpressInput', function () {
    describe('protected .createInputFromExpressController()', function () {
        it('is not called if the controller is not ExpressController', function () {
            const createInputFromExpressControllerSpy = Sinon.spy(RequestInput_1.RequestInput.prototype, 'createInputFromExpressController');
            const controller = Reflect.construct(Controller_1.Controller, [{ method: 'get' }]);
            new RequestInput_1.RequestInput(controller);
            expect(createInputFromExpressControllerSpy.called).toBe(false);
            createInputFromExpressControllerSpy.restore();
        });
        it('called by .constructor() to create input', function () {
            const createInputFromExpressControllerSpy = Sinon.spy(RequestInput_1.RequestInput.prototype, 'createInputFromExpressController');
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get' }]);
            new RequestInput_1.RequestInput(expressController);
            expect(createInputFromExpressControllerSpy.called).toBe(true);
            createInputFromExpressControllerSpy.restore();
        });
        it('creates input depends on request.method', function () { });
        it('creates input = merge(query, params) if that is GET request', function () {
            const request = {
                method: 'GET',
                body: { a: 1, d: 'body' },
                query: { b: 2, d: 'query' },
                params: { c: 3, d: 'params' }
            };
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [request]);
            const input = new RequestInput_1.RequestInput(expressController);
            expect(input['data']).toEqual({ b: 2, c: 3, d: 'params' });
        });
        it('creates input = merge(params, body) if that is PATCH, POST, PUT, PURGE, DELETE request', function () {
            const request = {
                method: '',
                body: { a: 1, d: 'body' },
                query: { b: 2, d: 'query' },
                params: { c: 3, d: 'params' }
            };
            const methods = ['PATCH', 'POST', 'PUT', 'PURGE', 'DELETE'];
            for (const method of methods) {
                request.method = method;
                const expressController = Reflect.construct(ExpressController_1.ExpressController, [request]);
                const input = new RequestInput_1.RequestInput(expressController);
                expect(input['data']).toEqual({ a: 1, c: 3, d: 'body' });
            }
        });
        it('creates input = merge(query, params, body) if that is the rest kind of request', function () {
            const request = {
                method: '',
                body: { a: 1, d: 'body' },
                query: { b: 2, d: 'query' },
                params: { c: 3, d: 'params' }
            };
            const methods = [
                'CHECKOUT',
                'COPY',
                'HEAD',
                'LOCK',
                'MERGE',
                'MKACTIVITY',
                'MKCOL',
                'MOVE',
                'M-SEARCH',
                'NOTIFY',
                'OPTIONS',
                'REPORT',
                'SEARCH',
                'SUBSCRIBE',
                'TRACE',
                'UNLOCK',
                'UNSUBSCRIBE'
            ];
            for (const method of methods) {
                request.method = method;
                const expressController = Reflect.construct(ExpressController_1.ExpressController, [request]);
                const input = new RequestInput_1.RequestInput(expressController);
                expect(input['data']).toEqual({ a: 1, b: 2, c: 3, d: 'body' });
            }
        });
    });
    describe('.getClassName()', function () {
        it('returns ContextualFacadeClass.Input', function () {
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get' }]);
            const input = new RequestInput_1.RequestInput(expressController);
            expect(input.getClassName()).toEqual(constants_1.ContextualFacadeClass.Input);
        });
    });
    describe('.get()', function () {
        it('calls implementation of RequestData.get()', function () {
            const requestDataSpy = Sinon.spy(RequestData_1.RequestData.prototype.get, 'apply');
            const input = new RequestInput_1.RequestInput({ request: { method: 'get' } });
            input.get('test');
            expect(requestDataSpy.calledWith(input)).toBe(true);
            expect(Array.from(requestDataSpy.firstCall.args[1])).toEqual(['test']);
            requestDataSpy.restore();
        });
    });
    describe('.has()', function () {
        it('calls implementation of RequestData.has()', function () {
            const requestDataSpy = Sinon.spy(RequestData_1.RequestData.prototype.has, 'apply');
            const input = new RequestInput_1.RequestInput({ request: { method: 'get' } });
            input.has('test');
            expect(requestDataSpy.calledWith(input)).toBe(true);
            expect(Array.from(requestDataSpy.firstCall.args[1])).toEqual(['test']);
            requestDataSpy.restore();
        });
    });
    describe('.all()', function () {
        it('calls implementation of RequestData.all()', function () {
            const requestDataSpy = Sinon.spy(RequestData_1.RequestData.prototype.all, 'apply');
            const input = new RequestInput_1.RequestInput({ request: { method: 'get' } });
            input.all();
            expect(input.all() === input['data']).toBe(true);
            expect(requestDataSpy.calledWith(input)).toBe(true);
            expect(Array.from(requestDataSpy.firstCall.args[1])).toEqual([]);
            requestDataSpy.restore();
        });
    });
    describe('.only()', function () {
        it('calls implementation of RequestData.all()', function () {
            const requestDataSpy = Sinon.spy(RequestData_1.RequestData.prototype.only, 'apply');
            const input = new RequestInput_1.RequestInput({ request: { method: 'get' } });
            input.only('a', 'b', ['c', 'd'], 'e');
            expect(requestDataSpy.calledWith(input)).toBe(true);
            expect(Array.from(requestDataSpy.firstCall.args[1])).toEqual(['a', 'b', ['c', 'd'], 'e']);
            requestDataSpy.restore();
        });
    });
    describe('.except()', function () {
        it('calls implementation of RequestData.all()', function () {
            const requestDataSpy = Sinon.spy(RequestData_1.RequestData.prototype.except, 'apply');
            const input = new RequestInput_1.RequestInput({ request: { method: 'get' } });
            input.except('a', 'b', ['c', 'd'], 'e');
            expect(requestDataSpy.calledWith(input)).toBe(true);
            expect(Array.from(requestDataSpy.firstCall.args[1])).toEqual(['a', 'b', ['c', 'd'], 'e']);
            requestDataSpy.restore();
        });
        it('proves that functionality of RequestData is re-used', function () {
            const input = new RequestInput_1.RequestInput({ request: { method: 'get' } });
            input['data'] = { a: 'a', b: undefined, c: 1, d: true, e: false, f: { a: 1, b: 2 }, g: [] };
            expect(input.except('a')).toEqual({ b: undefined, c: 1, d: true, e: false, f: { a: 1, b: 2 }, g: [] });
            expect(input.except('a', 'b')).toEqual({ c: 1, d: true, e: false, f: { a: 1, b: 2 }, g: [] });
            expect(input.except(['a', 'b', 'c'])).toEqual({ d: true, e: false, f: { a: 1, b: 2 }, g: [] });
            expect(input.except('a', ['b', 'c'], 'd', 'f')).toEqual({ e: false, g: [] });
            expect(input.except('a', ['b', 'c'], 'd', 'f.a')).toEqual({ e: false, f: { b: 2 }, g: [] });
        });
    });
});
