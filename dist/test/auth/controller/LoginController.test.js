"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_facade_1 = require("najs-facade");
const ConfigFacade_1 = require("../../../lib/facades/global/ConfigFacade");
const constants_1 = require("../../../lib/constants");
const constants_2 = require("../../../lib/constants");
const LoginController_1 = require("../../../lib/auth/controller/LoginController");
describe('LoginController', function () {
    it('implements IAutoload', function () {
        const controller = new LoginController_1.LoginController({ method: 'GET' }, {});
        expect(controller.getClassName()).toEqual(constants_2.AuthClass.LoginController);
    });
    describe('protected .getUrl()', function () {
        it('returns an url which in configuration by ConfigFacade', function () {
            ConfigFacade_1.ConfigFacade.shouldReceive('get').withArgs(constants_1.ConfigurationKeys.Auth.url + '.loginSuccess');
            const controller = new LoginController_1.LoginController({ method: 'GET' }, {});
            controller['getUrl']('loginSuccess');
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
    });
    describe('.login()', function () {
        it('redirects to "loginSuccess" if current user already logged in', async function () {
            ConfigFacade_1.ConfigFacade.shouldReceive('get').withArgs(constants_1.ConfigurationKeys.Auth.url + '.loginSuccess');
            const controller = new LoginController_1.LoginController({ method: 'GET' }, {});
            controller.auth = {
                check() {
                    return true;
                }
            };
            await controller.login();
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('calls auth.attempt with credentials is input.all() and remember also from input', async function () {
            ConfigFacade_1.ConfigFacade.shouldReceive('get').withArgs(constants_1.ConfigurationKeys.Auth.url + '.loginSuccess');
            const controller = new LoginController_1.LoginController({ method: 'POST', body: { user: 'test', remember: true } }, {});
            controller.auth = {
                check() {
                    return false;
                },
                attempt() {
                    return true;
                }
            };
            const attemptSpy = Sinon.spy(controller.auth, 'attempt');
            await controller.login();
            expect(attemptSpy.calledWith({ user: 'test', remember: true }, true)).toBe(true);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('redirects to "loginFailure" if attempt returns false', async function () {
            ConfigFacade_1.ConfigFacade.shouldReceive('get').withArgs(constants_1.ConfigurationKeys.Auth.url + '.loginFailure');
            const controller = new LoginController_1.LoginController({ method: 'POST', body: { user: 'test', remember: true } }, {});
            controller.auth = {
                check() {
                    return false;
                },
                attempt() {
                    return false;
                }
            };
            await controller.login();
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
    });
    describe('.logout()', function () {
        it('always redirects to "logoutRedirect"', async function () {
            ConfigFacade_1.ConfigFacade.shouldReceive('get').withArgs(constants_1.ConfigurationKeys.Auth.url + '.logoutRedirect');
            const controller = new LoginController_1.LoginController({ method: 'GET' }, {});
            controller.auth = {
                check() {
                    return false;
                },
                logout() { }
            };
            const logoutSpy = Sinon.spy(controller.auth, 'logout');
            await controller.logout();
            expect(logoutSpy.called).toBe(false);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('calls auth.logout() then redirects to "logoutRedirect" if there is a user', async function () {
            ConfigFacade_1.ConfigFacade.shouldReceive('get').withArgs(constants_1.ConfigurationKeys.Auth.url + '.logoutRedirect');
            const controller = new LoginController_1.LoginController({ method: 'GET' }, {});
            controller.auth = {
                check() {
                    return true;
                },
                logout() { }
            };
            const logoutSpy = Sinon.spy(controller.auth, 'logout');
            await controller.logout();
            expect(logoutSpy.called).toBe(true);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
    });
});
