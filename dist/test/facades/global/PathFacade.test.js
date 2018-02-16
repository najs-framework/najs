"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Make = require("../../../lib/core/make");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const PathFacade_1 = require("../../../lib/facades/global/PathFacade");
describe('PathFacade', function () {
    it('calls make() to create new instance of Path as a facade root', function () {
        const makeSpy = Sinon.spy(Make, 'make');
        PathFacade_1.PathFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.GlobalFacadeClass.Path)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
