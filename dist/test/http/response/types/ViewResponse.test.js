"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Lodash = require("lodash");
const ViewResponse_1 = require("../../../../lib/http/response/types/ViewResponse");
describe('ViewResponse', function () {
    it('can be created with view only', function () {
        const view = new ViewResponse_1.ViewResponse('view');
        expect(view['view']).toEqual('view');
        expect(view['variables']).toEqual({});
    });
    it('can be created with any view and variables', function () {
        const view = new ViewResponse_1.ViewResponse('view', { any: 'thing' });
        expect(view['view']).toEqual('view');
        expect(view['variables']).toEqual({ any: 'thing' });
    });
    it('calls IHttpDriver.respondView and passes response, this.view, this.variables', function () {
        const request = {};
        const response = {};
        const driver = { respondView() { } };
        const respondViewSpy = Sinon.spy(driver, 'respondView');
        const view = new ViewResponse_1.ViewResponse('view', { any: 'thing' });
        view.respond(request, response, driver);
        expect(respondViewSpy.calledWith(response, 'view', { any: 'thing' })).toBe(true);
    });
    describe('getVariables()', function () {
        it('returns variables property', function () {
            const view = new ViewResponse_1.ViewResponse('view', { any: 'thing' });
            expect(view['variables'] === view.getVariables()).toBe(true);
        });
    });
    describe('with(name, value)', function () {
        it('uses .set() of Lodash', function () {
            const setSpy = Sinon.spy(Lodash, 'set');
            const view = new ViewResponse_1.ViewResponse('view');
            view.with('name', 123);
            expect(setSpy.calledWith(view['variables'], 'name', 123)).toBe(true);
            setSpy.restore();
        });
        it('sets name, value to variables', function () {
            const view = new ViewResponse_1.ViewResponse('view');
            view.with('name', 123);
            view.with('test.a', 'something');
            view.with('undefined', undefined);
            view.with('name', 456);
            expect(view.getVariables()).toEqual({
                name: 456,
                test: {
                    a: 'something'
                },
                undefined: undefined
            });
        });
    });
});
