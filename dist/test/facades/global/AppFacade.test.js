"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Make = require("../../../lib/core/make");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const AppFacade_1 = require("../../../lib/facades/global/AppFacade");
describe('AppFacade', function () {
    it('calls make() to create new instance of Application as a facade root', function () {
        const makeSpy = Sinon.spy(Make, 'make');
        AppFacade_1.AppFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.GlobalFacadeClass.Application)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
