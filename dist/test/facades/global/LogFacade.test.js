"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const LogFacade_1 = require("../../../lib/facades/global/LogFacade");
describe('LogFacade', function () {
    it('calls make() to create new instance of WinstonLogger as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        LogFacade_1.LogFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.GlobalFacadeClass.Log)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
