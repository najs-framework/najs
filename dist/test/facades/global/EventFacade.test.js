"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Make = require("../../../lib/core/make");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const EventFacade_1 = require("../../../lib/facades/global/EventFacade");
describe('EventFacade', function () {
    it('calls make() to create new instance of Event as a facade root', function () {
        const makeSpy = Sinon.spy(Make, 'make');
        EventFacade_1.EventFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.GlobalFacade.Event)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
