"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Make = require("../../../lib/core/make");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const ResponseFacade_1 = require("../../../lib/facades/global/ResponseFacade");
describe('ResponseFacade', function () {
    it('calls make() to create new instance of Response as a facade root', function () {
        const makeSpy = Sinon.spy(Make, 'make');
        ResponseFacade_1.ResponseFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.GlobalFacadeClass.Response)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
