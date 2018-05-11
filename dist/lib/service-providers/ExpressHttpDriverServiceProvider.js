"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const ServiceProvider_1 = require("../core/ServiceProvider");
class ExpressHttpDriverServiceProvider extends ServiceProvider_1.ServiceProvider {
    getClassName() {
        return ExpressHttpDriverServiceProvider.className;
    }
    async register() {
        this.app.bind(constants_1.Najs.Http.HttpDriver, constants_1.Najs.Http.ExpressHttpDriver);
    }
}
ExpressHttpDriverServiceProvider.className = 'Najs.ExpressHttpDriverServiceProvider';
exports.ExpressHttpDriverServiceProvider = ExpressHttpDriverServiceProvider;
