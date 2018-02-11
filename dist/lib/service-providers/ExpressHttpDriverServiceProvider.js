"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const ServiceProvider_1 = require("../core/ServiceProvider");
const ExpressHttpDriver_1 = require("../http/driver/ExpressHttpDriver");
class ExpressHttpDriverServiceProvider extends ServiceProvider_1.ServiceProvider {
    getClassName() {
        return ExpressHttpDriverServiceProvider.className;
    }
    async register() {
        this.app.bind(constants_1.SystemClass.HttpDriver, ExpressHttpDriver_1.ExpressHttpDriver.className);
    }
}
ExpressHttpDriverServiceProvider.className = 'Najs.ExpressHttpDriverServiceProvider';
exports.ExpressHttpDriverServiceProvider = ExpressHttpDriverServiceProvider;
