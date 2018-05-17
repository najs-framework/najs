"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const EventFacade_1 = require("../../../lib/facades/global/EventFacade");
describe('EventFacade', function () {
    it('calls make() to create new instance of Event as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        EventFacade_1.EventFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith('Najs.Event.EventDispatcher')).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
