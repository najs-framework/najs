"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const BodyParserMiddleware_1 = require("../../../../lib/http/middleware/built-ins/BodyParserMiddleware");
const najs_binding_1 = require("najs-binding");
const isPromise_1 = require("../../../../lib/private/isPromise");
const HandlebarsHelper_1 = require("../../../../lib/view/handlebars/HandlebarsHelper");
const ViewResponse_1 = require("./../../../../lib/http/response/ViewResponse");
const HandlebarsViewResponse_1 = require("./../../../../lib/view/handlebars/HandlebarsViewResponse");
describe('BodyParserMiddleware', function () {
    it('implements IAutoload and auto register', function () {
        const middleware = new BodyParserMiddleware_1.BodyParserMiddleware('test');
        expect(middleware.getClassName()).toEqual(BodyParserMiddleware_1.BodyParserMiddleware.className);
        expect(najs_binding_1.ClassRegistry.has(BodyParserMiddleware_1.BodyParserMiddleware.className)).toBe(true);
    });
    describe('.parseParams()', function () {
        it('uses json and urlencoded by default', function () {
            const middleware = new BodyParserMiddleware_1.BodyParserMiddleware('test');
            expect(middleware['useJson']).toBe(true);
            expect(middleware['useUrlEncoded']).toBe(true);
        });
        it('parse and set use[Parser] if provided, there are 4 types: raw, text, json, urlencoded', function () {
            let middleware = new BodyParserMiddleware_1.BodyParserMiddleware('test', 'raw', 'text');
            expect(middleware['useJson']).toBe(false);
            expect(middleware['useUrlEncoded']).toBe(false);
            expect(middleware['useRaw']).toBe(true);
            expect(middleware['useText']).toBe(true);
            middleware = new BodyParserMiddleware_1.BodyParserMiddleware('test', 'json', 'text');
            expect(middleware['useJson']).toBe(true);
            expect(middleware['useUrlEncoded']).toBe(false);
            expect(middleware['useRaw']).toBe(false);
            expect(middleware['useText']).toBe(true);
        });
    });
    describe('.createMiddleware()', function () {
        it('returns undefined if there is no Parser was used', function () {
            const middleware = new BodyParserMiddleware_1.BodyParserMiddleware('test');
            middleware['useJson'] = false;
            middleware['useUrlEncoded'] = false;
            expect(middleware.createMiddleware()).toBeUndefined();
        });
        const parsers = ['Text', 'Json', 'UrlEncoded', 'Raw'];
        for (const name of parsers) {
            it('calls .get' + name + 'Options() and BodyParser.' + name.toLocaleLowerCase() + '() to create middleware', function () {
                const middleware = new BodyParserMiddleware_1.BodyParserMiddleware('test', name.toLowerCase());
                const getOptionsSpy = Sinon.spy(middleware, ('get' + name + 'Options'));
                expect(middleware.createMiddleware()).toHaveLength(1);
                expect(getOptionsSpy.called).toBe(true);
                getOptionsSpy.restore();
            });
        }
    });
    describe('.after()', function () {
        it('returns a promise', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = {};
            const instance = new BodyParserMiddleware_1.BodyParserMiddleware('test');
            const returnValue = instance.after(request, response, result, controller);
            expect(isPromise_1.isPromise(returnValue)).toBe(true);
        });
        it('does nothing if the view is ViewResponse', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = new ViewResponse_1.ViewResponse('test');
            const instance = new BodyParserMiddleware_1.BodyParserMiddleware('test');
            const returnValue = await instance.after(request, response, result, controller);
            expect(returnValue === result).toBe(true);
        });
        it('calls result.helper and add "Input", "Body", "Query", "Params" helpers if the view is HandlebarsViewResponse', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = new HandlebarsViewResponse_1.HandlebarsViewResponse('test');
            const helper = () => { };
            const createHelperStub = Sinon.stub(HandlebarsHelper_1.HandlebarsHelper, 'create');
            createHelperStub.returns(helper);
            const instance = new BodyParserMiddleware_1.BodyParserMiddleware('test');
            expect(result.getVariables()).toEqual({});
            const returnValue = await instance.after(request, response, result, controller);
            expect(result.getVariables()).toEqual({
                helpers: { Input: helper, Body: helper, Query: helper, Params: helper }
            });
            expect(returnValue === result).toBe(true);
            expect(createHelperStub.callCount).toEqual(4);
            createHelperStub.restore();
        });
    });
});
