"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Make = require("../../../lib/core/make");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const DispatcherFacade_1 = require("../../../lib/facades/global/DispatcherFacade");
describe('DispatcherFacade', function () {
    it('calls make() to create new instance of Dispatcher as a facade root', function () {
        const makeSpy = Sinon.spy(Make, 'make');
        DispatcherFacade_1.DispatcherFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.GlobalFacadeClass.Event)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
