"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const RedisFacade_1 = require("../../../lib/facades/global/RedisFacade");
describe('RedisFacade', function () {
    it('calls make() to create new instance of RedisClient as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        RedisFacade_1.RedisFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.Najs.Redis.RedisClient)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
