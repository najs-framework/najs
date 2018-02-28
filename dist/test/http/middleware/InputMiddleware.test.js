"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const InputMiddleware_1 = require("../../../lib/http/middleware/InputMiddleware");
const isPromise_1 = require("../../../lib/private/isPromise");
const ViewResponse_1 = require("../../../lib/http/response/types/ViewResponse");
const HandlebarsHelper_1 = require("../../../lib/view/handlebars/HandlebarsHelper");
const HandlebarsViewResponse_1 = require("../../../lib/view/handlebars/HandlebarsViewResponse");
describe('InputMiddleware', function () {
    it('is fit for najs-binding', function () {
        expect(InputMiddleware_1.InputMiddleware.className).toEqual('Najs.InputMiddleware');
    });
    describe('.after()', function () {
        it('returns a promise', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = {};
            const instance = new InputMiddleware_1.InputMiddleware();
            const returnValue = instance.after(request, response, result, controller);
            expect(isPromise_1.isPromise(returnValue)).toBe(true);
        });
        it('does nothing if the view is ViewResponse', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = new ViewResponse_1.ViewResponse('test');
            const instance = new InputMiddleware_1.InputMiddleware();
            const returnValue = await instance.after(request, response, result, controller);
            expect(returnValue === result).toBe(true);
        });
        it('calls result.helper and add "Input" helper if the view is HandlebarsViewResponse', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = new HandlebarsViewResponse_1.HandlebarsViewResponse('test');
            const helper = () => { };
            const createHelperStub = Sinon.stub(HandlebarsHelper_1.HandlebarsHelper, 'create');
            createHelperStub.returns(helper);
            const instance = new InputMiddleware_1.InputMiddleware();
            expect(result.getVariables()).toEqual({});
            const returnValue = await instance.after(request, response, result, controller);
            expect(result.getVariables()).toEqual({ helpers: { Input: helper } });
            expect(returnValue === result).toBe(true);
            expect(createHelperStub.callCount).toEqual(1);
            createHelperStub.restore();
        });
    });
});
