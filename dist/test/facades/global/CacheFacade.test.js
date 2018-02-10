"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Make = require("../../../lib/core/make");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const CacheFacade_1 = require("../../../lib/facades/global/CacheFacade");
describe('CacheFacade', function () {
    it('calls make() to create new instance of Application as a facade root', function () {
        const makeSpy = Sinon.spy(Make, 'make');
        CacheFacade_1.CacheFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.GlobalFacade.Cache)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
