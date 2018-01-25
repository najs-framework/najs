"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../constants");
const index_1 = require("../../index");
const Log_1 = require("../../log/Log");
// import { isFunction } from 'lodash'
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
    route(route) {
        const method = route.method.toLowerCase();
        if (ExpressHttpDriver.METHODS.indexOf(method) === -1) {
            return;
        }
        const path = route.prefix + route.path;
        const handler = this.getEndpointHandler(method, path, route);
        Reflect.apply(Reflect.get(this.express, method), this.express, [path, handler]);
    }
    getEndpointHandler(method, path, route) {
        return function (req, res) { };
    }
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
ExpressHttpDriver.METHODS = [
    'all',
    'checkout',
    'copy',
    'delete',
    'get',
    'head',
    'lock',
    'merge',
    'mkactivity',
    'mkcol',
    'move',
    'm-search',
    'notify',
    'options',
    'patch',
    'post',
    'purge',
    'put',
    'report',
    'search',
    'subscribe',
    'trace',
    'unlock',
    'unsubscribe'
];
ExpressHttpDriver.className = 'ExpressHttpDriver';
exports.ExpressHttpDriver = ExpressHttpDriver;
// register ExpressHttpDriver and using it as a default HttpDriverClass
index_1.register(ExpressHttpDriver);
index_1.register(ExpressHttpDriver, constants_1.HttpDriverClass);
