"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../constants");
const lodash_1 = require("lodash");
const index_1 = require("../../index");
const Express = require("express");
class ExpressHttpDriver {
    getClassName() {
        return ExpressHttpDriver.className;
    }
    getNativeDriver() {
        return this.express;
    }
    initialize() {
        this.express = lodash_1.isFunction(this.setupFunction) ? this.setupFunction() : this.defaultInitialize();
        if (lodash_1.isFunction(this.didSetupHandler)) {
            this.didSetupHandler(this.express);
        }
    }
    defaultInitialize() {
        const app = Express();
        return app;
    }
    setup(setupFunction) {
        this.setupFunction = setupFunction;
        return this;
    }
    driverDidSetup(handler) {
        this.didSetupHandler = handler;
        return this;
    }
    // -------------------------------------------------------------------------------------------------------------------
    route(route) { }
    start(options) { }
    respondJson(response, value) {
        response.json(value);
    }
    respondRedirect(response, url, status) {
        response.redirect(status, url);
    }
}
ExpressHttpDriver.className = 'ExpressHttpDriver';
exports.ExpressHttpDriver = ExpressHttpDriver;
// register ExpressHttpDriver and using it as a default HttpDriverClass
index_1.register(ExpressHttpDriver);
index_1.register(ExpressHttpDriver, constants_1.HttpDriverClass);
