"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Guard_1 = require("../../../lib/auth/guards/Guard");
const SessionGuard_1 = require("../../../lib/auth/guards/SessionGuard");
const constants_1 = require("./../../../lib/constants");
describe('SessionGuard', function () {
    it('extends Guard', function () {
        const controller = {};
        const provider = {};
        const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
        expect(guard).toBeInstanceOf(Guard_1.Guard);
    });
    it('implements IAutoload', function () {
        const controller = {};
        const provider = {};
        const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
        expect(guard.getClassName()).toEqual(constants_1.AuthClass.SessionGuard);
    });
    describe('.hasUser()', function () {
        it('returns true if there is a "getSessionKey" in session', function () {
            const controller = {
                session: { has() { } },
                cookie: { forget() { } }
            };
            const provider = {};
            const sessionHasStub = Sinon.stub(controller.session, 'has');
            sessionHasStub.returns(true);
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            expect(guard.hasUser()).toBe(true);
            expect(sessionHasStub.calledWith('user')).toBe(true);
        });
        it('returns true if there is a "getCookieRememberKey" in cookie', function () {
            const controller = {
                session: { has() { } },
                cookie: { has() { } }
            };
            const provider = {};
            const cookieHasStub = Sinon.stub(controller.cookie, 'has');
            cookieHasStub.returns(true);
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            expect(guard.hasUser()).toBe(true);
            expect(cookieHasStub.calledWith('auth')).toBe(true);
        });
        it('returns false if there is no key in session and cookie', function () {
            const controller = {
                session: { has() { } },
                cookie: { has() { } }
            };
            const provider = {};
            const sessionHasStub = Sinon.stub(controller.session, 'has');
            const cookieHasStub = Sinon.stub(controller.cookie, 'has');
            sessionHasStub.returns(false);
            cookieHasStub.returns(false);
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            expect(guard.hasUser()).toBe(false);
        });
        it('if "user" param is passed, it checks user in session with user.getAuthIdentifier()', function () {
            const controller = {
                session: { has() { }, get() { } },
                cookie: { forget() { } }
            };
            const provider = {};
            const user = {
                getAuthIdentifier() {
                    return 'test';
                }
            };
            const sessionHasStub = Sinon.stub(controller.session, 'has');
            sessionHasStub.returns(true);
            const sessionGetStub = Sinon.stub(controller.session, 'get');
            sessionGetStub.returns('test');
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            expect(guard.hasUser(user)).toBe(true);
            expect(sessionHasStub.calledWith('user')).toBe(true);
            expect(sessionGetStub.calledWith('user')).toBe(true);
            sessionGetStub.returns(false);
            expect(guard.hasUser(user)).toBe(false);
        });
        it('if "user" param is passed, user not in session, it checks user in cookie with user.getAuthIdentifier()', function () {
            const controller = {
                session: { has() { }, get() { } },
                cookie: { forget() { } }
            };
            const provider = {};
            const user = {
                getAuthIdentifier() {
                    return 'test';
                }
            };
            const sessionHasStub = Sinon.stub(controller.session, 'has');
            sessionHasStub.returns(false);
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            const getRememberDataStub = Sinon.stub(guard, 'getRememberData');
            getRememberDataStub.returns({ id: 'test' });
            expect(guard.hasUser(user)).toBe(true);
            expect(sessionHasStub.calledWith('user')).toBe(true);
            expect(getRememberDataStub.called).toBe(true);
            getRememberDataStub.returns({ id: undefined });
            expect(guard.hasUser(user)).toBe(false);
        });
    });
    describe('.retrieveUser()', function () {
        it('returns undefined if .hasUser() return false', async function () {
            const controller = {
                session: {
                    has() {
                        return false;
                    }
                },
                cookie: {}
            };
            const provider = {};
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            const hasUserStub = Sinon.stub(guard, 'hasUser');
            hasUserStub.returns(false);
            expect(await guard.retrieveUser()).toBeUndefined();
            expect(hasUserStub.called).toBe(true);
        });
        it('finds by using UserProvider.retrieveById() and returns result', async function () {
            const controller = {
                session: {
                    has() { },
                    get() { }
                },
                cookie: {}
            };
            const user = {};
            const provider = {
                async retrieveById() {
                    return user;
                }
            };
            const sessionGetStub = Sinon.stub(controller.session, 'get');
            sessionGetStub.returns('test');
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            const hasUserStub = Sinon.stub(guard, 'hasUser');
            hasUserStub.returns(true);
            expect((await guard.retrieveUser()) === user).toBe(true);
            expect(sessionGetStub.called).toBe(true);
        });
        it('finds by using UserProvider.retrieveById() and if it not found, uses UserProvider.retrieveByToken()', async function () {
            const controller = {
                session: {
                    has() { },
                    get() { }
                },
                cookie: {}
            };
            const user = {};
            const provider = {
                async retrieveById() {
                    return undefined;
                },
                async retrieveByToken() {
                    return user;
                }
            };
            const retrieveByTokenSpy = Sinon.spy(provider, 'retrieveByToken');
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            const getRememberDataStub = Sinon.stub(guard, 'getRememberData');
            getRememberDataStub.returns({ id: 'test', token: 'token' });
            const hasUserStub = Sinon.stub(guard, 'hasUser');
            hasUserStub.returns(true);
            expect((await guard.retrieveUser()) === user).toBe(true);
            expect(retrieveByTokenSpy.calledWith('test', 'token')).toBe(true);
        });
    });
    describe('.attachUser()', function () {
        it('calls session.put() and put the getAuthIdentifier() to "getSessionKey()"', function () {
            const controller = {
                session: { put() { } },
                cookie: {}
            };
            const provider = {};
            const sessionPutStub = Sinon.stub(controller.session, 'put');
            sessionPutStub.returns(true);
            const user = {
                getAuthIdentifier() {
                    return 'test';
                }
            };
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            const rememberUserSpy = Sinon.spy(guard, 'rememberUser');
            guard.attachUser(user, false);
            expect(sessionPutStub.calledWith('user', 'test')).toBe(true);
            expect(rememberUserSpy.calledWith(user)).toBe(false);
        });
        it('calls this.rememberUser() if the remember param is true', function () {
            const controller = {
                session: { put() { } },
                cookie: {}
            };
            const provider = {};
            const sessionPutStub = Sinon.stub(controller.session, 'put');
            sessionPutStub.returns(true);
            const user = {
                getAuthIdentifier() {
                    return 'test';
                }
            };
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            const rememberUserStub = Sinon.stub(guard, 'rememberUser');
            rememberUserStub.callsFake(() => { });
            guard.attachUser(user, true);
            expect(sessionPutStub.calledWith('user', 'test')).toBe(true);
            expect(rememberUserStub.calledWith(user)).toBe(true);
        });
    });
    describe('.detachUser()', function () {
        it('simply calls session.forget() and cookie.forget()', function () {
            const controller = {
                session: { forget() { } },
                cookie: { forget() { } }
            };
            const provider = {};
            const sessionForgetSpy = Sinon.spy(controller.session, 'forget');
            const cookieForgetSpy = Sinon.spy(controller.cookie, 'forget');
            const guard = Reflect.construct(SessionGuard_1.SessionGuard, [controller, provider]);
            guard.detachUser({});
            expect(sessionForgetSpy.calledWith('user')).toBe(true);
            expect(cookieForgetSpy.calledWith('auth')).toBe(true);
        });
    });
});
