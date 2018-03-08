"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Guard_1 = require("../../../lib/auth/guards/Guard");
describe('Guard', function () {
    it('implements partial IGuard', function () { });
    describe('constructor()', function () {
        it('assigns params to controller and provider, then call initialize()', function () {
            const controller = {};
            const provider = {};
            const guard = Reflect.construct(Guard_1.Guard, [controller, provider]);
            expect(guard.controller === controller).toBe(true);
            expect(guard.provider === provider).toBe(true);
        });
    });
    describe('.getUserProvider()', function () {
        it('returns a cookie remember key, default is "auth"', function () {
            const controller = {};
            const provider = {};
            const guard = Reflect.construct(Guard_1.Guard, [controller, provider]);
            expect(guard.getUserProvider() === provider).toBe(true);
        });
    });
    describe('protected .getCookieRememberKey()', function () {
        it('returns a cookie remember key, default is "auth"', function () {
            const controller = {};
            const provider = {};
            const guard = Reflect.construct(Guard_1.Guard, [controller, provider]);
            expect(guard['getCookieRememberKey']() === 'auth').toBe(true);
        });
    });
    describe('protected .getRememberData()', function () {
        it('returns remembered data in cookie', function () {
            const controller = {
                cookie: { get() { } }
            };
            const provider = {};
            const getSpy = Sinon.spy(controller.cookie, 'get');
            const guard = Reflect.construct(Guard_1.Guard, [controller, provider]);
            guard['getRememberData']();
            expect(getSpy.calledWith('auth', { id: undefined, token: '' })).toBe(true);
        });
    });
    describe('protected .rememberUser()', function () {
        it('creates token (random string), and call provider.updateRememberToken() then create a long-term cookie', async function () {
            const controller = {
                cookie: { forever() { } }
            };
            const provider = {
                async updateRememberToken() { }
            };
            const user = {
                getAuthIdentifier() {
                    return 123;
                }
            };
            const foreverSpy = Sinon.spy(controller.cookie, 'forever');
            const updateRememberTokenSpy = Sinon.spy(provider, 'updateRememberToken');
            const guard = Reflect.construct(Guard_1.Guard, [controller, provider]);
            await guard['rememberUser'](user);
            expect(foreverSpy.calledWith('auth')).toBe(true);
            expect(updateRememberTokenSpy.calledWith(user)).toBe(true);
        });
    });
});
