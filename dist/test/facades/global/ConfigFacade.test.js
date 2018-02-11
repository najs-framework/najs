"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Make = require("../../../lib/core/make");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const ConfigFacade_1 = require("../../../lib/facades/global/ConfigFacade");
describe('ConfigFacade', function () {
    it('calls make() to create new instance of Config as a facade root', function () {
        const makeSpy = Sinon.spy(Make, 'make');
        ConfigFacade_1.ConfigFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.GlobalFacade.Config)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
