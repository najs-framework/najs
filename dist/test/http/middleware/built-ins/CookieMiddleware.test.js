"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Middleware = require("../../../../lib/http/middleware/built-ins/CookieMiddleware");
const isPromise_1 = require("../../../../lib/private/isPromise");
const ViewResponse_1 = require("../../../../lib/http/response/types/ViewResponse");
const HandlebarsHelper_1 = require("../../../../lib/view/handlebars/HandlebarsHelper");
const HandlebarsViewResponse_1 = require("../../../../lib/view/handlebars/HandlebarsViewResponse");
const Cookie_1 = require("../../../../lib/http/cookie/Cookie");
const MemberProxy_1 = require("../../../../lib/http/controller/MemberProxy");
const ExpressMiddlewareBase_1 = require("../../../../lib/http/middleware/ExpressMiddlewareBase");
describe('CookieMiddleware', function () {
    it('extends ExpressMiddlewareBase', function () {
        const middleware = new Middleware.CookieMiddleware('cookie');
        expect(middleware).toBeInstanceOf(ExpressMiddlewareBase_1.ExpressMiddlewareBase);
    });
    it('implements IAutoload', function () {
        const middleware = new Middleware.CookieMiddleware('cookie');
        expect(middleware.getClassName()).toEqual(Middleware.CookieMiddleware.className);
    });
    it('has shared Express.RequestHandler called CookieParser which not init by default', function () {
        expect(Middleware.CookieParser).toBeUndefined();
    });
    describe('.createMiddleware()', function () {
        it('creates Cookie from "cookie-parser" if Cookie is not found', function () {
            const getSecretSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, 'getSecret');
            const getOptionsSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, 'getOptions');
            const instance = new Middleware.CookieMiddleware('cookie');
            instance.createMiddleware();
            expect(typeof Middleware.CookieParser === 'function').toBe(true);
            expect(getSecretSpy.called).toBe(true);
            expect(getOptionsSpy.called).toBe(true);
            getSecretSpy.restore();
            getOptionsSpy.restore();
        });
        it('returns CookieParser if it is exists', function () {
            const instance = new Middleware.CookieMiddleware('cookie');
            instance.createMiddleware();
            const getSecretSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, 'getSecret');
            const getOptionsSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, 'getOptions');
            instance.createMiddleware();
            expect(getSecretSpy.called).toBe(false);
            expect(getOptionsSpy.called).toBe(false);
            getSecretSpy.restore();
            getOptionsSpy.restore();
        });
    });
    describe('.before()', function () {
        it('use CookieContextualFacade to create a cookie in controller', function () {
            const instance = new Middleware.CookieMiddleware('cookie');
            const controller = {};
            instance.before({}, {}, controller);
            expect(controller['cookie']).toBeInstanceOf(Cookie_1.Cookie);
        });
        it('replaces an instance cookie in controller if it is MemberProxy instance', function () {
            const instance = new Middleware.CookieMiddleware('cookie');
            const controller = {
                cookie: new MemberProxy_1.MemberProxy('test', {})
            };
            instance.before({}, {}, controller);
            expect(controller['cookie']).toBeInstanceOf(Cookie_1.Cookie);
        });
    });
    describe('.after()', function () {
        it('returns a promise', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = {};
            const instance = new Middleware.CookieMiddleware('cookie');
            const returnValue = instance.after(request, response, result, controller);
            expect(isPromise_1.isPromise(returnValue)).toBe(true);
        });
        it('does nothing if the view is ViewResponse', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = new ViewResponse_1.ViewResponse('test');
            const instance = new Middleware.CookieMiddleware('cookie');
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
            const instance = new Middleware.CookieMiddleware('cookie');
            expect(result.getVariables()).toEqual({});
            const returnValue = await instance.after(request, response, result, controller);
            expect(result.getVariables()).toEqual({ helpers: { Cookie: helper } });
            expect(returnValue === result).toBe(true);
            createHelperStub.restore();
        });
    });
});
