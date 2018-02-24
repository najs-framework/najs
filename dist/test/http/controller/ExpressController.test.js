"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const ExpressController_1 = require("../../../lib/http/controller/ExpressController");
const najs_facade_1 = require("najs-facade");
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
        it('should init Input from `InputContextualFacade` with context is this', function () {
            const request = {
                method: 'get'
            };
            const expressController = Reflect.construct(ExpressController_1.ExpressController, [request, {}]);
            expect(expressController.input).toBeInstanceOf(najs_facade_1.ContextualFacade);
            expect(expressController.input['context'] === expressController).toBe(true);
        });
    });
});
