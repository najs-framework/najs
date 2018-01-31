"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../constants");
const index_1 = require("../../index");
const Log_1 = require("../../log/Log");
const lodash_1 = require("lodash");
const Controller_1 = require("../controller/Controller");
const RouteCollection_1 = require("../routing/RouteCollection");
const make_1 = require("../../core/make");
const IResponse_1 = require("../response/IResponse");
const Express = require("express");
const Http = require("http");
const isPromise_1 = require("../../private/isPromise");
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
        // create middleware handlers
        for (const middleware of route.middleware) {
            if (lodash_1.isFunction(middleware)) {
                handlers.push(middleware);
                continue;
            }
        }
        if (lodash_1.isFunction(route.endpoint)) {
            handlers.push(this.createEndpointWrapperByFunction(route.endpoint));
            return handlers;
        }
        if (lodash_1.isFunction(route.controller) || lodash_1.isString(route.controller)) {
            handlers.push(this.createEndpointWrapper(route.controller, route.endpoint));
            return handlers;
        }
        handlers.push(this.createEndpointWrapperByObject(route.controller, route.endpoint));
        return handlers;
    }
    createEndpointWrapper(controllerName, endpointName) {
        return async (request, response) => {
            const controller = make_1.make(controllerName, [request, response]);
            const endpoint = Reflect.get(controller, endpointName);
            if (lodash_1.isFunction(endpoint)) {
                const result = Reflect.apply(endpoint, controller, [request, response]);
                await this.handleEndpointResult(response, result);
            }
        };
    }
    createEndpointWrapperByObject(controllerObject, endpointName) {
        return async (request, response) => {
            const controller = this.cloneControllerObject(controllerObject, request, response);
            const endpoint = Reflect.get(controller, endpointName);
            if (lodash_1.isFunction(endpoint)) {
                const result = Reflect.apply(endpoint, controller, [request, response]);
                await this.handleEndpointResult(response, result);
            }
        };
    }
    cloneControllerObject(controller, request, response) {
        if (controller instanceof Controller_1.Controller) {
            return make_1.make(controller.getClassName(), [request, response]);
        }
        return Object.assign({}, controller, { request, response });
    }
    createEndpointWrapperByFunction(endpoint) {
        return async (request, response) => {
            // Can not use make for default Controller
            const controller = Reflect.construct(Controller_1.Controller, [request, response]);
            const result = Reflect.apply(endpoint, controller, [request, response]);
            await this.handleEndpointResult(response, result);
        };
    }
    async handleEndpointResult(response, result) {
        const value = isPromise_1.isPromise(result) ? await result : result;
        if (IResponse_1.isIResponse(value)) {
            return value.respond(response, this);
        }
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
    respondView(response, view, variables) {
        response.render(view, variables);
    }
    respondJson(response, value) {
        response.json(value);
    }
    respondJsonp(response, value) {
        response.jsonp(value);
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
