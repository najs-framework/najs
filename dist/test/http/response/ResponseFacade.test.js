"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ResponseFacade_1 = require("../../../lib/http/response/ResponseFacade");
const JsonResponse_1 = require("../../../lib/http/response/types/JsonResponse");
const RedirectResponse_1 = require("../../../lib/http/response/types/RedirectResponse");
describe('ResponseFacade', function () {
    describe('json', function () {
        it('creates new instance of JsonResponse', function () {
            const result = ResponseFacade_1.ResponseFacade.json('test');
            expect(result).toBeInstanceOf(JsonResponse_1.JsonResponse);
            expect(result['value']).toEqual('test');
        });
    });
    describe('redirect', function () {
        it('creates new instance of RedirectResponse', function () {
            let result = ResponseFacade_1.ResponseFacade.redirect('/path');
            expect(result).toBeInstanceOf(RedirectResponse_1.RedirectResponse);
            expect(result['url']).toEqual('/path');
            expect(result['status']).toEqual(302);
            result = ResponseFacade_1.ResponseFacade.redirect('/path', 301);
            expect(result).toBeInstanceOf(RedirectResponse_1.RedirectResponse);
            expect(result['url']).toEqual('/path');
            expect(result['status']).toEqual(301);
        });
    });
});
describe('JsonResponse', function () {
    it('can be created with any value', function () {
        const redirect = new JsonResponse_1.JsonResponse({ ok: true });
        expect(redirect['value']).toEqual({ ok: true });
    });
    it('calls IHttpDriver.respondJson and passes response, this.value', function () {
        const response = {};
        const driver = { respondJson(response, url, status) { } };
        const respondJsonSpy = Sinon.spy(driver, 'respondJson');
        const redirect = new JsonResponse_1.JsonResponse('any');
        redirect.respond(response, driver);
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
        const response = {};
        const driver = { respondRedirect(response, url, status) { } };
        const responseRedirectSpy = Sinon.spy(driver, 'respondRedirect');
        const redirect = new RedirectResponse_1.RedirectResponse('/path', 301);
        redirect.respond(response, driver);
        expect(responseRedirectSpy.calledWith(response, '/path', 301)).toBe(true);
    });
});
