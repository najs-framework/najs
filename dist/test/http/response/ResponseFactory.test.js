"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const ResponseFactory_1 = require("../../../lib/http/response/ResponseFactory");
const ViewResponse_1 = require("../../../lib/http/response/ViewResponse");
const JsonResponse_1 = require("../../../lib/http/response/JsonResponse");
const RedirectResponse_1 = require("../../../lib/http/response/RedirectResponse");
const BackResponse_1 = require("../../../lib/http/response/BackResponse");
const JsonpResponse_1 = require("../../../lib/http/response/JsonpResponse");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../../lib/constants");
const najs_binding_1 = require("najs-binding");
describe('ResponseFacade', function () {
    const Response = new ResponseFactory_1.ResponseFactory();
    it('extends from Facade so it definitely a FacadeClass', function () {
        expect(Response).toBeInstanceOf(najs_facade_1.Facade);
        expect(Response.getClassName()).toEqual(constants_1.GlobalFacadeClass.Response);
        expect(najs_binding_1.ClassRegistry.has(constants_1.GlobalFacadeClass.Response)).toBe(true);
    });
    describe('view', function () {
        it('creates new instance of ViewResponse', function () {
            const result = Response.view('test');
            expect(result).toBeInstanceOf(ViewResponse_1.ViewResponse);
            expect(result['view']).toEqual('test');
            expect(result['variables']).toEqual({});
        });
    });
    describe('json', function () {
        it('creates new instance of JsonResponse', function () {
            const result = Response.json('test');
            expect(result).toBeInstanceOf(JsonResponse_1.JsonResponse);
            expect(result['value']).toEqual('test');
        });
    });
    describe('jsonp', function () {
        it('creates new instance of JsonpResponse', function () {
            const result = Response.jsonp('test');
            expect(result).toBeInstanceOf(JsonpResponse_1.JsonpResponse);
            expect(result['value']).toEqual('test');
        });
    });
    describe('redirect', function () {
        it('creates new instance of RedirectResponse', function () {
            let result = Response.redirect('/path');
            expect(result).toBeInstanceOf(RedirectResponse_1.RedirectResponse);
            expect(result['url']).toEqual('/path');
            expect(result['status']).toEqual(302);
            result = Response.redirect('/path', 301);
            expect(result).toBeInstanceOf(RedirectResponse_1.RedirectResponse);
            expect(result['url']).toEqual('/path');
            expect(result['status']).toEqual(301);
        });
    });
    describe('back', function () {
        it('creates new instance of BackResponse', function () {
            let result = Response.back();
            expect(result).toBeInstanceOf(BackResponse_1.BackResponse);
            expect(result['defaultUrl']).toEqual('/');
            result = Response.back('/path');
            expect(result).toBeInstanceOf(BackResponse_1.BackResponse);
            expect(result['defaultUrl']).toEqual('/path');
        });
    });
});
