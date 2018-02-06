"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ExpressController_1 = require("../../../lib/http/controller/ExpressController");
describe('ExpressController', function () {
    describe('.constructor()', function () {
        it('should init body, params, and query from request', function () {
            const request = {
                method: 'GET',
                body: { a: 1 },
                query: { b: 2 },
                params: { c: 3 }
            };
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [request, {}]);
            expect(expressController['body']['data'] === request.body).toBe(true);
            expect(expressController['query']['data'] === request.query).toBe(true);
            expect(expressController['params']['data'] === request.params).toBe(true);
        });
        it('can init an empty Object if there is no body/query/params', function () {
            const request = {
                method: 'GET'
            };
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [request, {}]);
            expect(expressController['body']['data']).toEqual({});
            expect(expressController['query']['data']).toEqual({});
            expect(expressController['params']['data']).toEqual({});
        });
    });
    describe('protected .createInputFromRequest()', function () {
        it('called by .constructor() to create input', function () {
            const createInputFromRequestSpy = Sinon.spy(ExpressController_1.ExpressController.prototype, 'createInputFromRequest');
            Reflect.construct(ExpressController_1.ExpressController, [{ method: 'get' }, {}]);
            expect(createInputFromRequestSpy.called).toBe(true);
        });
        it('creates input depends on request.method', function () { });
        it('creates input = merge(query, params) if that is GET request', function () {
            const request = {
                method: 'GET',
                body: { a: 1, d: 'body' },
                query: { b: 2, d: 'query' },
                params: { c: 3, d: 'params' }
            };
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [request, {}]);
            expect(expressController['input']['data']).toEqual({ b: 2, c: 3, d: 'params' });
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
                const expressController = Reflect.construct(ExpressController_1.ExpressController, [request, {}]);
                expect(expressController['input']['data']).toEqual({ a: 1, c: 3, d: 'body' });
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
                const expressController = Reflect.construct(ExpressController_1.ExpressController, [request, {}]);
                expect(expressController['input']['data']).toEqual({ a: 1, b: 2, c: 3, d: 'body' });
            }
        });
    });
});
