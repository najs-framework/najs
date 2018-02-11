"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Najs_1 = require("../../lib/core/Najs");
const AppFacade_1 = require("../../lib/facades/global/AppFacade");
const ExpressHttpDriverServiceProvider_1 = require("../../lib/service-providers/ExpressHttpDriverServiceProvider");
const constants_1 = require("../../lib/constants");
const ExpressHttpDriver_1 = require("../../lib/http/driver/ExpressHttpDriver");
describe('ExpressHttpDriverServiceProvider', function () {
    it('has getClassName with namespace Najs', function () {
        const serviceProvider = new ExpressHttpDriverServiceProvider_1.ExpressHttpDriverServiceProvider({});
        expect(serviceProvider.getClassName()).toEqual(ExpressHttpDriverServiceProvider_1.ExpressHttpDriverServiceProvider.className);
    });
    describe('.register()', function () {
        it('binds ExpressHttpDriver class as default HttpDriver', async function () {
            const spy = AppFacade_1.AppFacade.spy('bind');
            const serviceProvider = new ExpressHttpDriverServiceProvider_1.ExpressHttpDriverServiceProvider(Najs_1.Najs['app']);
            await serviceProvider.register();
            expect(spy.calledWith(constants_1.SystemClass.HttpDriver, ExpressHttpDriver_1.ExpressHttpDriver.className)).toBe(true);
            AppFacade_1.AppFacade.restoreFacade();
        });
    });
});
