"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const CacheFacade_1 = require("../../../lib/facades/global/CacheFacade");
describe('CacheFacade', function () {
    it('calls make() to create new instance of RedisCache as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        CacheFacade_1.CacheFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.GlobalFacadeClass.Cache)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
