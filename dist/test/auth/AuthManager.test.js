"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../lib/auth/guards/SessionGuard");
require("../../lib/auth/GenericUser");
const Sinon = require("sinon");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../lib/constants");
const SessionGuard_1 = require("../../lib/auth/guards/SessionGuard");
const AuthManager_1 = require("../../lib/auth/AuthManager");
const constants_2 = require("../../lib/constants");
const EventFacade_1 = require("../../lib/facades/global/EventFacade");
const najs_binding_1 = require("najs-binding");
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
class MongooseProvider {
    getClassName() {
        return MongooseProvider.className;
    }
    getMongooseInstance() {
        return mongoose;
    }
    createModelFromSchema(modelName, schema) {
        return mongoose_1.model(modelName, schema);
    }
}
MongooseProvider.className = 'MongooseProvider';
najs_binding_1.register(MongooseProvider);
describe('AuthManager', function () {
    it('extends from ContextualFacade', function () {
        const authManager = new AuthManager_1.AuthManager({});
        expect(authManager).toBeInstanceOf(najs_facade_1.ContextualFacade);
    });
    it('implements IAutoload', function () {
        const authManager = new AuthManager_1.AuthManager({});
        expect(authManager.getClassName()).toEqual(constants_2.ContextualFacadeClass.Auth);
    });
    describe('constructor()', function () {
        it('gets guard configurations and load guard when constructed', function () {
            const guardSpy = Sinon.spy(AuthManager_1.AuthManager.prototype, 'guard');
            const findDefaultGuardNameSpy = Sinon.spy(AuthManager_1.AuthManager.prototype, 'findDefaultGuardName');
            new AuthManager_1.AuthManager({});
            expect(findDefaultGuardNameSpy.called).toBe(true);
            expect(guardSpy.called).toBe(true);
            findDefaultGuardNameSpy.restore();
            guardSpy.restore();
        });
    });
    describe('.findDefaultGuardName()', function () {
        it('loops all configuration and returns the one which has isDefault=true', function () {
            const authManager = new AuthManager_1.AuthManager({});
            authManager['configurations'] = {
                test: {
                    driver: 'Najs.SessionGuard',
                    provider: 'Najs.GenericUser'
                },
                default: {
                    driver: 'Najs.SessionGuard',
                    provider: 'Najs.GenericUser',
                    isDefault: true
                }
            };
            expect(authManager.findDefaultGuardName()).toEqual('default');
        });
        it('return the first one if no guard settings has isDefault', function () {
            const authManager = new AuthManager_1.AuthManager({});
            authManager['configurations'] = {
                test: {
                    driver: 'Najs.SessionGuard',
                    provider: 'Najs.GenericUser'
                },
                default: {
                    driver: 'Najs.SessionGuard',
                    provider: 'Najs.GenericUser'
                }
            };
            expect(authManager.findDefaultGuardName()).toEqual('test');
        });
    });
    describe('.resolveGuard()', function () {
        it('auto switches to defaultGuardName if the name not in configuration', function () {
            const authManager = new AuthManager_1.AuthManager({});
            expect(authManager.resolveGuard('not-found')).toBeInstanceOf(SessionGuard_1.SessionGuard);
        });
        it('resolves Guard by make, the provider also resolved', function () {
            class TestGuard {
                constructor(controller, provider) {
                    this.controller = controller;
                    this.provider = provider;
                }
            }
            TestGuard.className = 'TestGuard';
            najs_binding_1.register(TestGuard);
            class TestProvider {
            }
            TestProvider.className = 'TestProvider';
            najs_binding_1.register(TestProvider);
            const controller = {};
            const authManager = new AuthManager_1.AuthManager(controller);
            authManager['configurations'] = {
                test: {
                    driver: TestGuard.className,
                    provider: TestProvider.className
                }
            };
            const instance = authManager.resolveGuard('test');
            expect(instance).toBeInstanceOf(TestGuard);
            expect(instance['controller'] === controller).toBe(true);
            expect(instance['provider']).toBeInstanceOf(TestProvider);
        });
    });
    describe('.guard()', function () {
        it('is chain-able', function () {
            const authManager = new AuthManager_1.AuthManager({});
            expect(authManager.guard('web') === authManager).toBe(true);
        });
        it('just assigns currentGuard if the name already in guardBag (cached)', function () {
            const authManager = new AuthManager_1.AuthManager({});
            const guard = {};
            authManager['guardBag']['test'] = guard;
            authManager.guard('test');
            expect(authManager.getCurrentGuard() === guard).toBe(true);
        });
        it('calls .resolveGuard() and assign to currentGuard if has result', function () {
            const authManager = new AuthManager_1.AuthManager({});
            const guard = {};
            const resolveGuardStub = Sinon.stub(authManager, 'resolveGuard');
            resolveGuardStub.returns(guard);
            authManager.guard('test');
            expect(authManager['guardBag']['test'] === guard).toBe(true);
            expect(authManager.getCurrentGuard() === guard).toBe(true);
        });
        it('it does nothing if the .resolveGuard() returns no result', function () {
            const authManager = new AuthManager_1.AuthManager({});
            const guard = {};
            authManager['guardBag']['test'] = guard;
            authManager.guard('test');
            const resolveGuardStub = Sinon.stub(authManager, 'resolveGuard');
            resolveGuardStub.returns(undefined);
            authManager.guard('default');
            expect(authManager.getCurrentGuard() === guard).toBe(true);
        });
    });
    describe('.getCurrentGuard()', function () {
        it('simple returns "currentGuard" member', function () {
            const authManager = new AuthManager_1.AuthManager({});
            expect(authManager.getCurrentGuard() === authManager['currentGuard']).toBe(true);
        });
    });
    describe('.login()', function () {
        it('triggers event Login, case 1', function () {
            const user = {};
            const guard = {
                attachUser() { }
            };
            najs_facade_1.Facade(EventFacade_1.EventFacade)
                .shouldReceive('emit')
                .withArgs(constants_1.AuthEvent.Login, user, true);
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentGuard'] = guard;
            authManager.login(user, true);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('triggers event Login, case 2', function () {
            const user = {};
            const guard = {
                attachUser() { }
            };
            najs_facade_1.Facade(EventFacade_1.EventFacade)
                .shouldReceive('emit')
                .withArgs(constants_1.AuthEvent.Login, user, false);
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentGuard'] = guard;
            authManager.login(user);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('calls guard.attachUser() then call .setUser()', async function () {
            const user = {};
            const guard = {
                attachUser() { }
            };
            const authManager = new AuthManager_1.AuthManager({});
            const setUserSpy = Sinon.spy(authManager, 'setUser');
            const attachUserSpy = Sinon.spy(guard, 'attachUser');
            authManager['currentGuard'] = guard;
            await authManager.login(user, true);
            expect(setUserSpy.calledWith(user)).toBe(true);
            expect(attachUserSpy.calledWith(user, true)).toBe(true);
            await authManager.login(user, false);
            expect(setUserSpy.calledWith(user)).toBe(true);
            expect(attachUserSpy.calledWith(user, false)).toBe(true);
        });
    });
    describe('.logout()', function () {
        it('triggers event Logout', function () {
            const user = {};
            najs_facade_1.Facade(EventFacade_1.EventFacade)
                .shouldReceive('emit')
                .withArgs(constants_1.AuthEvent.Logout, user);
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentUser'] = user;
            authManager['loggedOut'] = true;
            authManager.logout();
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('does nothing if loggedOut is true', function () {
            const guard = {
                hasUser() { },
                detachUser() { }
            };
            const detachUserSpy = Sinon.spy(guard, 'detachUser');
            const hasUserSpy = Sinon.spy(guard, 'hasUser');
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentGuard'] = guard;
            authManager['loggedOut'] = true;
            authManager.logout();
            expect(detachUserSpy.called).toBe(false);
            expect(hasUserSpy.called).toBe(false);
        });
        it('does nothing if currentUser is undefined', function () {
            const guard = {
                hasUser() { },
                detachUser() { }
            };
            const detachUserSpy = Sinon.spy(guard, 'detachUser');
            const hasUserSpy = Sinon.spy(guard, 'hasUser');
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentGuard'] = guard;
            authManager['currentUser'] = undefined;
            authManager['loggedOut'] = false;
            authManager.logout();
            expect(detachUserSpy.called).toBe(false);
            expect(hasUserSpy.called).toBe(false);
        });
        it('assigns currentUser to undefined, loggedOut = true, call guard.detachUser() depends on if guard.hasUser()', function () {
            const guard = {
                hasUser() { },
                detachUser() { }
            };
            const detachUserSpy = Sinon.spy(guard, 'detachUser');
            const hasUserStub = Sinon.stub(guard, 'hasUser');
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentGuard'] = guard;
            authManager['currentUser'] = {};
            authManager['loggedOut'] = false;
            hasUserStub.returns(false);
            authManager.logout();
            expect(detachUserSpy.called).toBe(false);
            expect(hasUserStub.called).toBe(true);
            expect(authManager['currentUser']).toBeUndefined();
            expect(authManager['loggedOut']).toEqual(true);
            authManager['currentGuard'] = guard;
            authManager['currentUser'] = {};
            authManager['loggedOut'] = false;
            hasUserStub.returns(true);
            authManager.logout();
            expect(detachUserSpy.called).toBe(true);
            expect(hasUserStub.called).toBe(true);
            expect(authManager['currentUser']).toBeUndefined();
            expect(authManager['loggedOut']).toEqual(true);
        });
    });
    describe('.attempt()', function () {
        it('triggers event Attempt', function () {
            const guard = {
                getUserProvider() {
                    return {
                        retrieveByCredentials() {
                            return undefined;
                        }
                    };
                }
            };
            const credentials = {};
            najs_facade_1.Facade(EventFacade_1.EventFacade)
                .shouldReceive('emit')
                .withArgs(constants_1.AuthEvent.Attempt, credentials, false, true);
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentGuard'] = guard;
            authManager.attempt(credentials);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('calls guard.getUserProvider().retrieveByCredentials(), returns false if the result is not found', async function () {
            const guard = {
                getUserProvider() {
                    return {
                        retrieveByCredentials() {
                            return undefined;
                        }
                    };
                }
            };
            const credentials = {};
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentGuard'] = guard;
            expect(await authManager.attempt(credentials, true, false)).toEqual(false);
        });
        it('returns false is .retrieveByCredentials() returns user but .validateCredentials() returns false', async function () {
            const guard = {
                getUserProvider() {
                    return {
                        retrieveByCredentials() {
                            return {};
                        },
                        validateCredentials() {
                            return false;
                        }
                    };
                }
            };
            const credentials = {};
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentGuard'] = guard;
            expect(await authManager.attempt(credentials, true, false)).toEqual(false);
        });
        it('returns true is .retrieveByCredentials() returns an user and .validateCredentials() returns true', async function () {
            const guard = {
                getUserProvider() {
                    return {
                        retrieveByCredentials() {
                            return {};
                        },
                        validateCredentials() {
                            return true;
                        }
                    };
                }
            };
            const credentials = {};
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentGuard'] = guard;
            expect(await authManager.attempt(credentials, true, false)).toEqual(true);
        });
        it('calls .login() if the login param is true', async function () {
            const user = {};
            const guard = {
                getUserProvider() {
                    return {
                        retrieveByCredentials() {
                            return user;
                        },
                        validateCredentials() {
                            return true;
                        }
                    };
                }
            };
            const credentials = {};
            const authManager = new AuthManager_1.AuthManager({});
            authManager['currentGuard'] = guard;
            const loginStub = Sinon.stub(authManager, 'login');
            loginStub.callsFake(() => { });
            await authManager.attempt(credentials, true, false);
            expect(loginStub.calledWith(user, true)).toBe(false);
            await authManager.attempt(credentials, false, true);
            expect(loginStub.calledWith(user, false)).toBe(true);
        });
    });
    describe('.validate()', function () {
        it('simply calls .attempt() with remember = false and login = false', function () {
            const attemptStub = Sinon.stub(AuthManager_1.AuthManager.prototype, 'attempt');
            attemptStub.returns(Promise.resolve(true));
            attemptStub.callsFake(() => { });
            const credentials = {};
            const authManager = new AuthManager_1.AuthManager({});
            authManager.validate(credentials);
            expect(attemptStub.calledWith(credentials, false, false)).toBe(true);
            attemptStub.restore();
        });
    });
    describe('.check()', function () {
        it('returns true if .getUser() returns truly value', function () {
            const authManager = new AuthManager_1.AuthManager({});
            const getUserStub = Sinon.stub(authManager, 'getUser');
            getUserStub.returns(undefined);
            expect(authManager.check()).toBe(false);
            getUserStub.returns(false);
            expect(authManager.check()).toBe(false);
            getUserStub.returns('');
            expect(authManager.check()).toBe(false);
            getUserStub.returns('id');
            expect(authManager.check()).toBe(true);
            getUserStub.returns(true);
            expect(authManager.check()).toBe(true);
            getUserStub.returns({});
            expect(authManager.check()).toBe(true);
        });
    });
    describe('.guest()', function () {
        it('returns !value of if .check()', function () {
            const authManager = new AuthManager_1.AuthManager({});
            const checkStub = Sinon.stub(authManager, 'check');
            checkStub.returns(true);
            expect(authManager.guest()).toBe(false);
            checkStub.returns(false);
            expect(authManager.guest()).toBe(true);
        });
    });
    describe('.user()', function () {
        it('is an alias of .getUser()', function () {
            const authManager = new AuthManager_1.AuthManager({});
            const getUserSpy = Sinon.spy(authManager, 'getUser');
            authManager.user();
            expect(getUserSpy.called).toBe(true);
        });
    });
    describe('.id()', function () {
        it('returns undefined if loggedOut is true', function () {
            const authManager = new AuthManager_1.AuthManager({});
            authManager['loggedOut'] = true;
            const user = {
                getAuthIdentifier() {
                    return 'test';
                }
            };
            authManager['currentUser'] = user;
            expect(authManager.id()).toBeUndefined();
        });
        it('returns undefined if loggedOut is false but currentUser is not found', function () {
            const authManager = new AuthManager_1.AuthManager({});
            authManager['loggedOut'] = true;
            authManager['currentUser'] = undefined;
            expect(authManager.id()).toBeUndefined();
        });
        it('returns "currentUser.getAuthIdentifier()"', function () {
            const authManager = new AuthManager_1.AuthManager({});
            authManager['loggedOut'] = false;
            const user = {
                getAuthIdentifier() {
                    return 'test';
                }
            };
            authManager['currentUser'] = user;
            expect(authManager.id()).toEqual('test');
        });
    });
    describe('.getUser()', function () {
        it('always returns undefined if loggedOut is true', function () {
            const authManager = new AuthManager_1.AuthManager({});
            authManager['loggedOut'] = true;
            const user = {};
            authManager['currentUser'] = user;
            expect(authManager.getUser()).toBeUndefined();
        });
        it('returns "currentUser" member if loggedOut is false', function () {
            const authManager = new AuthManager_1.AuthManager({});
            authManager['loggedOut'] = false;
            const user = {};
            authManager['currentUser'] = user;
            expect(authManager.getUser() === user).toBe(true);
        });
    });
    describe('.setUser()', function () {
        it('assigns user to "currentUser" and set loggedOut to false', function () {
            const authManager = new AuthManager_1.AuthManager({});
            authManager['loggedOut'] = true;
            const user = {};
            authManager.setUser(user);
            expect(authManager['currentUser'] === user).toBe(true);
            expect(authManager['loggedOut']).toBe(false);
        });
    });
});
