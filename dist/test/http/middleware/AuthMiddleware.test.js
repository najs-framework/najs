"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const Middleware = require("../../../lib/http/middleware/AuthMiddleware");
const najs_facade_1 = require("najs-facade");
const ConfigFacade_1 = require("../../../lib/facades/global/ConfigFacade");
const AuthManager_1 = require("../../../lib/auth/AuthManager");
describe('AuthMiddleware', function () {
    it('is fit for najs-binding', function () {
        expect(Middleware.AuthMiddleware.className).toEqual('Najs.AuthMiddleware');
    });
    describe('.before()', function () {
        async function test_before_function(guardCalled) {
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
            const guardSpy = Sinon.spy(AuthManager_1.AuthManager.prototype, 'guard');
            const getStub = najs_facade_1.Facade(ConfigFacade_1.ConfigFacade).createStub('get');
            getStub.returns({
                web: {
                    driver: 'TestGuard',
                    provider: 'TestProvider',
                    isDefault: true
                }
            });
            const middleware = new Middleware.AuthMiddleware(guardCalled ? 'test' : undefined);
            const request = {};
            const response = {};
            const controller = {};
            await middleware.before(request, response, controller);
            expect(controller['auth']).toBeInstanceOf(AuthManager_1.AuthManager);
            expect(guardSpy.calledWith('test')).toBe(guardCalled);
            guardSpy.restore();
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        }
        it('simply create AuthContextualFacade for the given controller', function () {
            return test_before_function(false);
        });
        it('changes guard if provided by syntax "auth:web"', function () {
            return test_before_function(true);
        });
    });
});
