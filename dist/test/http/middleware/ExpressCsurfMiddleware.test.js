"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Middleware = require("../../../lib/http/middleware/ExpressCsurfMiddleware");
const make_1 = require("../../../lib/core/make");
const isPromise_1 = require("../../../lib/private/isPromise");
const ViewResponse_1 = require("./../../../lib/http/response/types/ViewResponse");
describe('ExpressCsurfMiddleware', function () {
    it('has shared Express.RequestHandler called CsurfProtection which not init by default', function () {
        expect(Middleware.CsurfProtection).toBeUndefined();
    });
    it('creates CsurfProtection from "csurf" module with {cookie: true} options when constructor called', function () {
        const getOptionsSpy = Sinon.spy(Middleware.ExpressCsurfMiddleware.prototype, 'getOptions');
        make_1.make(Middleware.ExpressCsurfMiddleware.className);
        expect(typeof Middleware.CsurfProtection === 'function').toBe(true);
        expect(getOptionsSpy.called).toBe(true);
        getOptionsSpy.restore();
    });
    it('creates CsurfProtection only one time', function () {
        const getOptionsSpy = Sinon.spy(Middleware.ExpressCsurfMiddleware.prototype, 'getOptions');
        make_1.make(Middleware.ExpressCsurfMiddleware.className);
        expect(getOptionsSpy.called).toBe(false);
    });
    it('implements IAutoload interface with class name "ExpressCsurfMiddleware"', function () {
        expect(new Middleware.ExpressCsurfMiddleware().getClassName()).toEqual('ExpressCsurfMiddleware');
    });
    describe('.before()', function () {
        it('returns a promise, which calls CsurfProtection with request, response and fake next function', async function () {
            const request = {};
            const response = {};
            const instance = new Middleware.ExpressCsurfMiddleware();
            function fakeCsurfProtection(request, response, done) {
                done();
            }
            const csurfProtectionStub = Sinon.stub(Middleware, 'CsurfProtection');
            csurfProtectionStub.callsFake(fakeCsurfProtection);
            const result = instance.before(request, response);
            expect(isPromise_1.isPromise(result)).toBe(true);
            expect(csurfProtectionStub.firstCall.args[0] === request).toBe(true);
            expect(csurfProtectionStub.firstCall.args[1] === response).toBe(true);
            expect(typeof csurfProtectionStub.firstCall.args[2] === 'function').toBe(true);
            csurfProtectionStub.restore();
        });
        it('sets promise to Rejected if there is an error', async function () {
            const instance = new Middleware.ExpressCsurfMiddleware();
            function fakeCsurfProtection(request, response, done) {
                done(new Error('Test'));
            }
            const csurfProtectionStub = Sinon.stub(Middleware, 'CsurfProtection');
            csurfProtectionStub.callsFake(fakeCsurfProtection);
            try {
                await instance.before({}, {});
            }
            catch (error) {
                expect(error.message).toEqual('Test');
                csurfProtectionStub.restore();
                return;
            }
            expect('should not reach this line').toEqual('hmm');
        });
    });
    describe('.after()', function () {
        it('returns a promise', async function () {
            const request = {};
            const response = {};
            const result = {};
            const instance = new Middleware.ExpressCsurfMiddleware();
            const returnValue = instance.after(request, response, result);
            expect(isPromise_1.isPromise(returnValue)).toBe(true);
        });
        it('returns result itself if it not a ViewResponse', async function () {
            const request = {};
            const response = {};
            const result = {};
            const instance = new Middleware.ExpressCsurfMiddleware();
            const value = await instance.after(request, response, result);
            expect(value === result).toBe(true);
        });
        it('calls .with("csrfToken") if result is a ViewResponse, csrf get from request.csrfToken()', async function () {
            const request = {
                csrfToken() {
                    return 'test-csrf-token';
                }
            };
            const response = {};
            const result = new ViewResponse_1.ViewResponse('any');
            const instance = new Middleware.ExpressCsurfMiddleware();
            expect(result['variables']['csrfToken']).toBeUndefined();
            expect(result['variables']['CsrfToken']).toBeUndefined();
            expect(result['variables']['csrf_token']).toBeUndefined();
            expect(result['variables']['CSRF_TOKEN']).toBeUndefined();
            const value = await instance.after(request, response, result);
            expect(value === result).toBe(true);
            expect(result['variables']['csrfToken']).toEqual('test-csrf-token');
            expect(result['variables']['CsrfToken']).toEqual('test-csrf-token');
            expect(result['variables']['csrf_token']).toEqual('test-csrf-token');
            expect(result['variables']['CSRF_TOKEN']).toEqual('test-csrf-token');
        });
    });
});
