"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const najs_binding_1 = require("najs-binding");
const index_1 = require("../../index");
const LogFacade_1 = require("../../facades/global/LogFacade");
const lodash_1 = require("lodash");
const Controller_1 = require("../controller/Controller");
const ExpressController_1 = require("../controller/ExpressController");
const RouteCollection_1 = require("../routing/RouteCollection");
const IResponse_1 = require("../response/IResponse");
const isPromise_1 = require("../../private/isPromise");
const ConfigFacade_1 = require("../../facades/global/ConfigFacade");
const PathFacade_1 = require("../../facades/global/PathFacade");
const Express = require("express");
const Http = require("http");
const ExpressHandlebars = require("express-handlebars");
const addRequestIdMiddleware = require('express-request-id')();
class ExpressHttpDriver {
    constructor() {
        this.express = this.setup();
        this.httpKernel = najs_binding_1.make(constants_1.SystemClass.HttpKernel);
    }
    static setXPoweredByMiddleware(poweredBy = 'Najs/Express') {
        return function (request, response, next) {
            response.setHeader('X-Powered-By', poweredBy);
            next();
        };
    }
    static addRequestIdMiddleware(poweredBy = 'Najs/Express') {
        return addRequestIdMiddleware;
    }
    setup() {
        const app = Express();
        this.setupViewEngine(app);
        this.setupStaticAssets(app);
        app.use(ExpressHttpDriver.addRequestIdMiddleware());
        app.use(ExpressHttpDriver.setXPoweredByMiddleware());
        return app;
    }
    setupViewEngine(app) {
        const viewEngine = ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.ViewEngineName, 'hbs');
        app.engine(viewEngine, ExpressHandlebars(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.HandlebarsOptions, {
            layoutsDir: PathFacade_1.PathFacade.layout(),
            extname: '.hbs',
            defaultLayout: 'default'
        })));
        app.set('view engine', viewEngine);
        app.set('views', PathFacade_1.PathFacade.view());
    }
    setupStaticAssets(app) {
        app.use(Express.static(PathFacade_1.PathFacade.public()));
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
        LogFacade_1.LogFacade.info('  [' + method.toUpperCase() + '] \t' + path);
        Reflect.apply(Reflect.get(this.express, method), this.express, [path, ...handlers]);
    }
    getEndpointHandlers(method, path, route) {
        const handlers = [];
        // create middleware handlers
        const middlewareListBucket = [];
        for (const middleware of route.middleware) {
            if (lodash_1.isFunction(middleware)) {
                handlers.push(middleware);
                continue;
            }
            middlewareListBucket.push(this.getMiddlewareList(middleware));
        }
        const middlewareList = Array.from(new Set(lodash_1.flatten(middlewareListBucket)));
        if (middlewareList.length > 0) {
            this.createNativeMiddlewareWrapper(middlewareList);
        }
        if (lodash_1.isFunction(route.endpoint)) {
            handlers.push(this.createEndpointWrapperByFunction(route.endpoint, middlewareList));
            return handlers;
        }
        if (lodash_1.isFunction(route.controller) || lodash_1.isString(route.controller)) {
            handlers.push(this.createEndpointWrapper(route.controller, route.endpoint, middlewareList));
            return handlers;
        }
        handlers.push(this.createEndpointWrapperByObject(route.controller, route.endpoint, middlewareList));
        return handlers;
    }
    getMiddlewareList(middleware) {
        if (lodash_1.isString(middleware)) {
            return this.httpKernel.getMiddleware(middleware);
        }
        if (lodash_1.isObject(middleware)) {
            return [middleware];
        }
        return [];
    }
    createNativeMiddlewareWrapper(middlewareList) {
        for (const middleware of middlewareList) {
            if (lodash_1.isFunction(middleware.native)) {
                Reflect.apply(middleware.native, middleware, [this]);
            }
        }
    }
    createEndpointWrapper(controllerName, endpointName, middleware) {
        return async (request, response) => {
            const controller = najs_binding_1.make(controllerName, [request, response]);
            const endpoint = Reflect.get(controller, endpointName);
            if (lodash_1.isFunction(endpoint)) {
                await this.triggerEndpoint(controller, endpoint, request, response, middleware);
            }
        };
    }
    createEndpointWrapperByObject(controllerObject, endpointName, middleware) {
        return async (request, response) => {
            const controller = this.cloneControllerObject(controllerObject, request, response);
            const endpoint = Reflect.get(controller, endpointName);
            if (lodash_1.isFunction(endpoint)) {
                await this.triggerEndpoint(controller, endpoint, request, response, middleware);
            }
        };
    }
    cloneControllerObject(controller, request, response) {
        if (controller instanceof Controller_1.Controller) {
            return najs_binding_1.make(controller.getClassName(), [request, response]);
        }
        return Object.assign({}, controller, { request, response });
    }
    createEndpointWrapperByFunction(endpoint, middleware) {
        return async (request, response) => {
            // Can not use make for default ExpressController
            const controller = Reflect.construct(ExpressController_1.ExpressController, [request, response]);
            await this.triggerEndpoint(controller, endpoint, request, response, middleware);
        };
    }
    async triggerEndpoint(controller, endpoint, request, response, middleware) {
        await this.applyBeforeMiddleware(middleware, request, response, controller);
        const result = Reflect.apply(endpoint, controller, [request, response]);
        return this.handleEndpointResult(request, response, result, controller, middleware);
    }
    async applyBeforeMiddleware(middlewareList, request, response, controller) {
        if (middlewareList.length === 0) {
            return;
        }
        for (const middleware of middlewareList) {
            if (lodash_1.isFunction(middleware.before)) {
                await Reflect.apply(middleware.before, middleware, [request, response, controller]);
            }
        }
    }
    async applyAfterMiddleware(middlewareList, request, response, value, controller) {
        if (middlewareList.length === 0) {
            return value;
        }
        let result = value;
        for (const middleware of middlewareList) {
            if (lodash_1.isFunction(middleware.after)) {
                result = await Reflect.apply(middleware.after, middleware, [request, response, result, controller]);
            }
        }
        return result;
    }
    async handleEndpointResult(request, response, result, controller, middleware) {
        const rawValue = isPromise_1.isPromise(result) ? await result : result;
        const value = await this.applyAfterMiddleware(middleware, request, response, rawValue, controller);
        if (IResponse_1.isIResponse(value)) {
            return value.respond(request, response, this);
        }
    }
    start(options) {
        RouteCollection_1.RouteCollection.getData().map(this.route.bind(this));
        const opts = Object.assign({}, {
            createServer: true,
            port: ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Port, 3000),
            host: ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Host, 'localhost')
        }, options);
        if (opts.createServer) {
            const server = Http.createServer(this.express);
            server.listen(opts.port, opts.host);
            const logs = ['Listening at '];
            logs.push(opts.host + ':');
            logs.push(opts.port);
            LogFacade_1.LogFacade.info(logs.join(''));
            LogFacade_1.LogFacade.info('Routes:');
        }
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
index_1.register(ExpressHttpDriver);
