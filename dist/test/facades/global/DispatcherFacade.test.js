"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const DispatcherFacade_1 = require("../../../lib/facades/global/DispatcherFacade");
describe('DispatcherFacade', function () {
    it('calls make() to create new instance of Dispatcher as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        DispatcherFacade_1.DispatcherFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith('Najs.Event.EventDispatcher')).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
