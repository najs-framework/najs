"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const CookieContextualFacade_1 = require("../../../lib/facades/contextual/CookieContextualFacade");
describe('CookieContextualFacade', function () {
    it('is created only one time if context has no "cookie" property', function () {
        const request = {
            method: 'GET'
        };
        const context = { request: request };
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        CookieContextualFacade_1.Cookie.of(context);
        expect(context['cookie'] === CookieContextualFacade_1.Cookie.of(context)).toBe(true);
        expect(context['cookie'] === CookieContextualFacade_1.Cookie.of(context)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
