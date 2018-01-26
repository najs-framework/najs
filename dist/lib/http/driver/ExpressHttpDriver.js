"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../constants");
const index_1 = require("../../index");
const Log_1 = require("../../log/Log");
const lodash_1 = require("lodash");
const Express = require("express");
const Http = require("http");
const Controller_1 = require("../controller/Controller");
const RouteCollection_1 = require("../routing/RouteCollection");
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
        const handlers = this.getEndpointHandlers(method, path, route);
        if (handlers.length === 0) {
            return;
        }
        Log_1.Log.info('  [' + method.toUpperCase() + '] \t' + path);
        Reflect.apply(Reflect.get(this.express, method), this.express, [path, ...handlers]);
    }
    getEndpointHandlers(method, path, route) {
        const handlers = [];
        if (lodash_1.isFunction(route.endpoint)) {
            handlers.push(this.createEndpointWrapperByFunction(route.endpoint));
            // if endpoint is function, there is no reason to go further
            return handlers;
        }
        // create hand
        return handlers;
    }
    createEndpointWrapperByFunction(endpoint) {
        return (request, response) => {
            const controller = Reflect.construct(Controller_1.Controller, [request, response]);
            const result = Reflect.apply(endpoint, controller, [request, response]);
            if (typeof result !== 'undefined' && lodash_1.isFunction(result.respond)) {
                result.respond(response, this);
            }
        };
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
        Log_1.Log.info('Routes:');
        RouteCollection_1.RouteCollection.getData().map(this.route.bind(this));
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
