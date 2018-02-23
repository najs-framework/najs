"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const InputContextualFacade_1 = require("../../../lib/facades/contextual/InputContextualFacade");
describe('InputContextualFacade', function () {
    it('is created only one time if context has no "input" property', function () {
        const request = {
            method: 'GET'
        };
        const context = { request: request };
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        InputContextualFacade_1.Input.of(context);
        expect(context['input'] === InputContextualFacade_1.Input.of(context)).toBe(true);
        expect(context['input'] === InputContextualFacade_1.Input.from(context)).toBe(true);
        expect(context['input'] === InputContextualFacade_1.Input.of(context)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
