"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const AppFacade_1 = require("../../../lib/facades/global/AppFacade");
describe('AppFacade', function () {
    it('calls make() to create new instance of Application as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        AppFacade_1.AppFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith('Najs.Application')).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
