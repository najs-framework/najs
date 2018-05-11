"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const ResponseFacade_1 = require("../../../lib/facades/global/ResponseFacade");
describe('ResponseFacade', function () {
    it('calls make() to create new instance of Response as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        ResponseFacade_1.ResponseFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith('Najs.Http.ResponseFactory')).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
