"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const RedirectResponse_1 = require("../../../../lib/http/response/types/RedirectResponse");
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
