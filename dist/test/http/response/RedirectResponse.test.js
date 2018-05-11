"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const RedirectResponse_1 = require("../../../lib/http/response/RedirectResponse");
describe('RedirectResponse', function () {
    it('implements contract Najs.Contracts.Response with class name Najs.Http.Response.RedirectResponse', function () {
        const response = new RedirectResponse_1.RedirectResponse('/');
        expect(response.getClassName()).toEqual('Najs.Http.Response.RedirectResponse');
    });
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
