"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/auth/guards/SessionGuard");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const AuthContextualFacade_1 = require("../../../lib/facades/contextual/AuthContextualFacade");
const ConfigFacade_1 = require("../../../lib/facades/global/ConfigFacade");
const constants_1 = require("../../../lib/constants");
describe('AuthContextualFacade', function () {
    it('is created only one time if context has no "auth" property', function () {
        class TestProvider {
        }
        TestProvider.className = 'TestProvider';
        NajsBinding.register(TestProvider);
        const getStub = najs_facade_1.Facade(ConfigFacade_1.ConfigFacade).createStub('get');
        getStub.returns({
            web: {
                driver: 'Najs.SessionGuard',
                provider: 'TestProvider',
                isDefault: true
            }
        });
        const request = {
            method: 'GET'
        };
        const context = { request: request };
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        AuthContextualFacade_1.Auth.of(context);
        expect(context['auth'] === AuthContextualFacade_1.Auth.of(context)).toBe(true);
        expect(context['auth'] === AuthContextualFacade_1.Auth.of(context)).toBe(true);
        expect(makeSpy.calledWith(constants_1.ContextualFacadeClass.Auth)).toBe(true);
        najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
    });
});
