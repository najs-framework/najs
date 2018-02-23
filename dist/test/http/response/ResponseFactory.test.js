"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ResponseFactory_1 = require("../../../lib/http/response/ResponseFactory");
const ViewResponse_1 = require("../../../lib/http/response/types/ViewResponse");
const JsonResponse_1 = require("../../../lib/http/response/types/JsonResponse");
const RedirectResponse_1 = require("../../../lib/http/response/types/RedirectResponse");
const BackResponse_1 = require("../../../lib/http/response/types/BackResponse");
const JsonpResponse_1 = require("../../../lib/http/response/types/JsonpResponse");
const Facade_1 = require("../../../lib/facades/Facade");
const constants_1 = require("../../../lib/constants");
const najs_binding_1 = require("najs-binding");
describe('ResponseFacade', function () {
    const Response = new ResponseFactory_1.ResponseFactory();
    it('extends from Facade so it definitely a FacadeClass', function () {
        expect(Response).toBeInstanceOf(Facade_1.Facade);
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
describe('ViewResponse', function () {
    it('can be created with view only', function () {
        const view = new ViewResponse_1.ViewResponse('view');
        expect(view['view']).toEqual('view');
        expect(view['variables']).toEqual({});
    });
    it('can be created with any view and variables', function () {
        const view = new ViewResponse_1.ViewResponse('view', { any: 'thing' });
        expect(view['view']).toEqual('view');
        expect(view['variables']).toEqual({ any: 'thing' });
    });
    it('calls IHttpDriver.respondView and passes response, this.view, this.variables', function () {
        const request = {};
        const response = {};
        const driver = { respondView() { } };
        const respondViewSpy = Sinon.spy(driver, 'respondView');
        const view = new ViewResponse_1.ViewResponse('view', { any: 'thing' });
        view.respond(request, response, driver);
        expect(respondViewSpy.calledWith(response, 'view', { any: 'thing' })).toBe(true);
    });
    describe('getVariables()', function () {
        it('returns variables property', function () {
            const view = new ViewResponse_1.ViewResponse('view', { any: 'thing' });
            expect(view['variables'] === view.getVariables()).toBe(true);
        });
    });
    describe('with(name, value)', function () {
        it('sets name, value to variables', function () {
            const view = new ViewResponse_1.ViewResponse('view');
            view.with('name', 123);
            view.with('test', 'something');
            view.with('undefined', undefined);
            view.with('name', 456);
            expect(view.getVariables()).toEqual({
                name: 456,
                test: 'something',
                undefined: undefined
            });
        });
    });
});
describe('JsonResponse', function () {
    it('can be created with any value', function () {
        const json = new JsonResponse_1.JsonResponse({ ok: true });
        expect(json['value']).toEqual({ ok: true });
    });
    it('calls IHttpDriver.respondJson and passes response, this.value', function () {
        const request = {};
        const response = {};
        const driver = { respondJson() { } };
        const respondJsonSpy = Sinon.spy(driver, 'respondJson');
        const json = new JsonResponse_1.JsonResponse('any');
        json.respond(request, response, driver);
        expect(respondJsonSpy.calledWith(response, 'any')).toBe(true);
    });
});
describe('JsonpResponse', function () {
    it('can be created with any value', function () {
        const redirect = new JsonpResponse_1.JsonpResponse({ ok: true });
        expect(redirect['value']).toEqual({ ok: true });
    });
    it('calls IHttpDriver.respondJson and passes response, this.value', function () {
        const request = {};
        const response = {};
        const driver = { respondJsonp(response, url, status) { } };
        const respondJsonSpy = Sinon.spy(driver, 'respondJsonp');
        const redirect = new JsonpResponse_1.JsonpResponse('any');
        redirect.respond(request, response, driver);
        expect(respondJsonSpy.calledWith(response, 'any')).toBe(true);
    });
});
describe('RedirectResponse', function () {
    it('can be created with default status = 302', function () {
        const redirect = new RedirectResponse_1.RedirectResponse('/path');
        expect(redirect['url']).toEqual('/path');
        expect(redirect['status']).toEqual(302);
    });
    it('can be created with custom status', function () {
        const redirect = new RedirectResponse_1.RedirectResponse('/path', 301);
        expect(redirect['url']).toEqual('/path');
        expect(redirect['status']).toEqual(301);
    });
    it('calls IHttpDriver.respondRedirect and passes response, this.url, this.status', function () {
        const request = {};
        const response = {};
        const driver = { respondRedirect(response, url, status) { } };
        const responseRedirectSpy = Sinon.spy(driver, 'respondRedirect');
        const redirect = new RedirectResponse_1.RedirectResponse('/path', 301);
        redirect.respond(request, response, driver);
        expect(responseRedirectSpy.calledWith(response, '/path', 301)).toBe(true);
    });
});
describe('BackResponse', function () {
    it('can be created with default url = /', function () {
        const redirect = new BackResponse_1.BackResponse();
        expect(redirect['defaultUrl']).toEqual('/');
    });
    it('can be created with custom default url', function () {
        const redirect = new BackResponse_1.BackResponse('/path');
        expect(redirect['defaultUrl']).toEqual('/path');
    });
    it('calls IHttpDriver.respondRedirect and passes response, request.header("Referer"), status 302', function () {
        const request = {
            header() {
                return 'anything';
            }
        };
        const response = {};
        const driver = { respondRedirect(response, url, status) { } };
        const responseRedirectSpy = Sinon.spy(driver, 'respondRedirect');
        const redirect = new BackResponse_1.BackResponse('/path');
        redirect.respond(request, response, driver);
        expect(responseRedirectSpy.calledWith(response, 'anything', 302)).toBe(true);
    });
    it('calls IHttpDriver.respondRedirect and passes response, this.defaultUrl, status 302 if there is no Referer in header', function () {
        const request = {
            header() {
                return undefined;
            }
        };
        const response = {};
        const driver = { respondRedirect(response, url, status) { } };
        const responseRedirectSpy = Sinon.spy(driver, 'respondRedirect');
        const redirect = new BackResponse_1.BackResponse('/path');
        redirect.respond(request, response, driver);
        expect(responseRedirectSpy.calledWith(response, '/path', 302)).toBe(true);
    });
});
