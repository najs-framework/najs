"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Middleware = require("../../../lib/http/middleware/CookieMiddleware");
const najs_binding_1 = require("najs-binding");
const isPromise_1 = require("../../../lib/private/isPromise");
const ViewResponse_1 = require("../../../lib/http/response/types/ViewResponse");
const HandlebarsHelper_1 = require("../../../lib/view/handlebars/HandlebarsHelper");
const HandlebarsViewResponse_1 = require("../../../lib/view/handlebars/HandlebarsViewResponse");
describe('CookieMiddleware', function () {
    it('is fit for najs-binding', function () {
        expect(Middleware.CookieMiddleware.className).toEqual('Najs.CookieMiddleware');
    });
    it('has shared Express.RequestHandler called CookieParser which not init by default', function () {
        expect(Middleware.CookieParser).toBeUndefined();
    });
    it('creates CookieParser from "cookie-parser" module with secret = "najs" by default when constructor called', function () {
        const getSecretSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, 'getSecret');
        const getOptionsSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, 'getOptions');
        najs_binding_1.make(Middleware.CookieMiddleware.className);
        expect(typeof Middleware.CookieParser === 'function').toBe(true);
        expect(getSecretSpy.called).toBe(true);
        expect(getOptionsSpy.called).toBe(true);
        getSecretSpy.restore();
        getOptionsSpy.restore();
    });
    describe('.before()', function () {
        it('returns a promise, which calls CookieParser with request, response and fake next function', async function () {
            const request = {};
            const response = {};
            const instance = new Middleware.CookieMiddleware();
            function fakeCookieParser(request, response, done) {
                done();
            }
            const cookieParserStub = Sinon.stub(Middleware, 'CookieParser');
            cookieParserStub.callsFake(fakeCookieParser);
            const result = instance.before(request, response);
            expect(isPromise_1.isPromise(result)).toBe(true);
            expect(cookieParserStub.firstCall.args[0] === request).toBe(true);
            expect(cookieParserStub.firstCall.args[1] === response).toBe(true);
            expect(typeof cookieParserStub.firstCall.args[2] === 'function').toBe(true);
            cookieParserStub.restore();
        });
        it('sets promise to Rejected if there is an error', async function () {
            const instance = new Middleware.CookieMiddleware();
            function fakeCookieParser(request, response, done) {
                done(new Error('Test'));
            }
            const cookieParserStub = Sinon.stub(Middleware, 'CookieParser');
            cookieParserStub.callsFake(fakeCookieParser);
            try {
                await instance.before({}, {});
            }
            catch (error) {
                expect(error.message).toEqual('Test');
                cookieParserStub.restore();
                return;
            }
            expect('should not reach this line').toEqual('hmm');
        });
    });
    describe('.after()', function () {
        it('returns a promise', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = {};
            const instance = new Middleware.CookieMiddleware();
            const returnValue = instance.after(request, response, result, controller);
            expect(isPromise_1.isPromise(returnValue)).toBe(true);
        });
        it('does nothing if the view is ViewResponse', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = new ViewResponse_1.ViewResponse('test');
            const instance = new Middleware.CookieMiddleware();
            const returnValue = await instance.after(request, response, result, controller);
            expect(returnValue === result).toBe(true);
        });
        it('calls result.helper and add "Cookie" helper if the view is HandlebarsViewResponse', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = new HandlebarsViewResponse_1.HandlebarsViewResponse('test');
            const helper = () => { };
            const createHelperStub = Sinon.stub(HandlebarsHelper_1.HandlebarsHelper, 'create');
            createHelperStub.returns(helper);
            const instance = new Middleware.CookieMiddleware();
            expect(result.getVariables()).toEqual({});
            const returnValue = await instance.after(request, response, result, controller);
            expect(result.getVariables()).toEqual({ helpers: { Cookie: helper } });
            expect(returnValue === result).toBe(true);
            createHelperStub.restore();
        });
    });
});
