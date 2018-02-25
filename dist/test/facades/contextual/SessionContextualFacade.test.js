"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const SessionContextualFacade_1 = require("../../../lib/facades/contextual/SessionContextualFacade");
describe('SessionContextualFacade', function () {
    it('is created only one time if context has no "session" property', function () {
        const request = {
            method: 'GET'
        };
        const context = { request: request };
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        SessionContextualFacade_1.Session.of(context);
        expect(context['session'] === SessionContextualFacade_1.Session.of(context)).toBe(true);
        expect(context['session'] === SessionContextualFacade_1.Session.of(context)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
