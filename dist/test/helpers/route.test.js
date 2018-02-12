"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const RouteFacade_1 = require("../../lib/facades/global/RouteFacade");
const Sinon = require("sinon");
const route_1 = require("../../lib/helpers/route");
describe('route()', function () {
    it('just an alias of Route.createByName()', function () {
        const routeFacadeCreateByNameStub = Sinon.stub(RouteFacade_1.RouteFacade, 'createByName');
        route_1.route('test');
        expect(routeFacadeCreateByNameStub.calledWith('test')).toBe(true);
        route_1.route('test', {});
        expect(routeFacadeCreateByNameStub.calledWith('test', {})).toBe(true);
        route_1.route('test', { id: 123, name: 'any' });
        expect(routeFacadeCreateByNameStub.calledWith('test', { id: 123, name: 'any' })).toBe(true);
        const options = { encode: (v) => v };
        route_1.route('test', { id: 123, name: 'any' }, options);
        expect(routeFacadeCreateByNameStub.calledWith('test', { id: 123, name: 'any' }, options)).toBe(true);
        routeFacadeCreateByNameStub.restore();
    });
});
