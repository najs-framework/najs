"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Najs_1 = require("../../lib/core/Najs");
const AppFacade_1 = require("../../lib/facades/global/AppFacade");
const HandlebarsViewServiceProvider_1 = require("../../lib/service-providers/HandlebarsViewServiceProvider");
describe('HandlebarsViewServiceProvider', function () {
    it('has getClassName with namespace Najs', function () {
        const serviceProvider = new HandlebarsViewServiceProvider_1.HandlebarsViewServiceProvider({});
        expect(serviceProvider.getClassName()).toEqual(HandlebarsViewServiceProvider_1.HandlebarsViewServiceProvider.className);
    });
    describe('.register()', function () {
        it('binds ExpressHttpDriver class as default HttpDriver', async function () {
            const spy = AppFacade_1.AppFacade.spy('bind');
            const serviceProvider = new HandlebarsViewServiceProvider_1.HandlebarsViewServiceProvider(Najs_1.Najs['app']);
            await serviceProvider.register();
            expect(spy.calledWith('Najs.Http.Response.ViewResponse', 'Najs.Http.Response.HandlebarsViewResponse')).toBe(true);
            AppFacade_1.AppFacade.restoreFacade();
        });
    });
    describe('static .withHandlebarsHelpers', function () {
        it('returns typeof HandlebarsViewServiceProvider', function () {
            expect(HandlebarsViewServiceProvider_1.HandlebarsViewServiceProvider.withHandlebarsHelpers() === HandlebarsViewServiceProvider_1.HandlebarsViewServiceProvider).toBe(true);
        });
        it('fattens params and pass to "handlebars-helpers" package', function () {
            HandlebarsViewServiceProvider_1.HandlebarsViewServiceProvider.withHandlebarsHelpers(['array', 'code']);
        });
    });
});
