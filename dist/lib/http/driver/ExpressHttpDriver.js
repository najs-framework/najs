"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../constants");
const index_1 = require("../../index");
const Log_1 = require("../../log/Log");
const Express = require("express");
const Http = require("http");
class ExpressHttpDriver {
    constructor() {
        this.express = this.setup();
    }
    setup() {
        const app = Express();
        return app;
    }
    getClassName() {
        return ExpressHttpDriver.className;
    }
    getNativeDriver() {
        return this.express;
    }
    // -------------------------------------------------------------------------------------------------------------------
    route(route) { }
    start(options) {
        const server = Http.createServer(this.express);
        server.listen(options.port, options.host);
        const logs = ['Listening at port '];
        if (options.host) {
            logs.push(options.host + ':');
        }
        logs.push(options.port || 3000);
        Log_1.Log.info(logs.join(''));
    }
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
