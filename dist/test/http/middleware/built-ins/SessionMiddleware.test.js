"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Middleware = require("../../../../lib/http/middleware/built-ins/SessionMiddleware");
const Session_1 = require("../../../../lib/http/session/Session");
const isPromise_1 = require("../../../../lib/private/isPromise");
const ViewResponse_1 = require("../../../../lib/http/response/types/ViewResponse");
const HandlebarsHelper_1 = require("../../../../lib/view/handlebars/HandlebarsHelper");
const HandlebarsViewResponse_1 = require("../../../../lib/view/handlebars/HandlebarsViewResponse");
const MemberProxy_1 = require("../../../../lib/http/controller/MemberProxy");
const ExpressMiddlewareBase_1 = require("../../../../lib/http/middleware/ExpressMiddlewareBase");
describe('SessionMiddleware', function () {
    it('extends ExpressMiddlewareBase', function () {
        const middleware = new Middleware.SessionMiddleware('session');
        expect(middleware).toBeInstanceOf(ExpressMiddlewareBase_1.ExpressMiddlewareBase);
    });
    it('implements IAutoload', function () {
        const middleware = new Middleware.SessionMiddleware('session');
        expect(middleware.getClassName()).toEqual(Middleware.SessionMiddleware.className);
    });
    it('has shared Express.RequestHandler called Session which not init by default', function () {
        expect(Middleware.Session).toBeUndefined();
    });
    describe('.createMiddleware()', function () {
        it('creates Session from "express-session" if Session is not found', function () {
            const makeStoreSpy = Sinon.spy(Middleware.SessionMiddleware.prototype, 'makeStore');
            const getOptionsSpy = Sinon.spy(Middleware.SessionMiddleware.prototype, 'getOptions');
            const instance = new Middleware.SessionMiddleware('session');
            instance.createMiddleware();
            expect(typeof Middleware.Session === 'function').toBe(true);
            expect(makeStoreSpy.called).toBe(true);
            expect(getOptionsSpy.called).toBe(true);
            makeStoreSpy.restore();
            getOptionsSpy.restore();
        });
        it('returns Session if it is exists', function () {
            const instance = new Middleware.SessionMiddleware('session');
            instance.createMiddleware();
            const makeStoreSpy = Sinon.spy(Middleware.SessionMiddleware.prototype, 'makeStore');
            const getOptionsSpy = Sinon.spy(Middleware.SessionMiddleware.prototype, 'getOptions');
            instance.createMiddleware();
            expect(makeStoreSpy.called).toBe(false);
            expect(getOptionsSpy.called).toBe(false);
            makeStoreSpy.restore();
            getOptionsSpy.restore();
        });
    });
    describe('.before()', function () {
        it('use SessionContextualFacade to create a session in controller', function () {
            const instance = new Middleware.SessionMiddleware('session');
            const controller = {};
            instance.before({}, {}, controller);
            expect(controller['session']).toBeInstanceOf(Session_1.Session);
        });
        it('replaces an instance session in controller if it is MemberProxy instance', function () {
            const instance = new Middleware.SessionMiddleware('session');
            const controller = {
                session: new MemberProxy_1.MemberProxy('test', {})
            };
            instance.before({}, {}, controller);
            expect(controller['session']).toBeInstanceOf(Session_1.Session);
        });
    });
    describe('.after()', function () {
        it('returns a promise', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = {};
            const instance = new Middleware.SessionMiddleware('session');
            const returnValue = instance.after(request, response, result, controller);
            expect(isPromise_1.isPromise(returnValue)).toBe(true);
        });
        it('does nothing if the view is ViewResponse', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = new ViewResponse_1.ViewResponse('test');
            const instance = new Middleware.SessionMiddleware('session');
            const returnValue = await instance.after(request, response, result, controller);
            expect(returnValue === result).toBe(true);
        });
        it('calls result.helper and add "Session" helper if the view is HandlebarsViewResponse', async function () {
            const request = {};
            const response = {};
            const controller = {};
            const result = new HandlebarsViewResponse_1.HandlebarsViewResponse('test');
            const helper = () => { };
            const createHelperStub = Sinon.stub(HandlebarsHelper_1.HandlebarsHelper, 'create');
            createHelperStub.returns(helper);
            const instance = new Middleware.SessionMiddleware('session');
            expect(result.getVariables()).toEqual({});
            const returnValue = await instance.after(request, response, result, controller);
            expect(result.getVariables()).toEqual({ helpers: { Session: helper } });
            expect(returnValue === result).toBe(true);
            createHelperStub.restore();
        });
    });
});
