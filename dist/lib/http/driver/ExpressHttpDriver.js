"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const index_1 = require("../../index");
const Log_1 = require("../../log/Log");
const lodash_1 = require("lodash");
const Controller_1 = require("../controller/Controller");
const ExpressController_1 = require("../controller/ExpressController");
const RouteCollection_1 = require("../routing/RouteCollection");
const make_1 = require("../../core/make");
const IResponse_1 = require("../response/IResponse");
const isPromise_1 = require("../../private/isPromise");
const NajsFacade_1 = require("../../core/NajsFacade");
const INajsFacade_1 = require("../../core/INajsFacade");
const Express = require("express");
const Http = require("http");
const BodyParser = require("body-parser");
const CookieParser = require("cookie-parser");
const ExpressHandlerBars = require("express-handlebars");
class ExpressHttpDriver {
    constructor() {
        this.express = this.setup();
        this.httpKernel = make_1.make(constants_1.HttpKernelClass);
    }
    static setXPoweredByMiddleware(poweredBy = 'Najs/Express') {
        return function (request, response, next) {
            response.setHeader('X-Powered-By', poweredBy);
            next();
        };
    }
    setup() {
        const app = Express();
        this.setupBodyParser(app);
        this.setupCookieParser(app);
        this.setupViewEngine(app);
        this.setupStaticAssets(app);
        app.use(ExpressHttpDriver.setXPoweredByMiddleware());
        return app;
    }
    setupBodyParser(app) {
        app.use(BodyParser.json());
        app.use(BodyParser.urlencoded({ extended: true }));
    }
    setupCookieParser(app) {
        app.use(CookieParser());
    }
    setupViewEngine(app) {
        const viewEngine = NajsFacade_1.NajsFacade.getConfig(constants_1.ConfigurationKeys.ViewEngineName, 'hbs');
        app.engine(viewEngine, ExpressHandlerBars(NajsFacade_1.NajsFacade.getConfig(constants_1.ConfigurationKeys.HandlerBarsOptions, {
            layoutsDir: NajsFacade_1.NajsFacade.path(INajsFacade_1.NajsPath.Layout),
            extname: '.hbs',
            defaultLayout: 'default'
        })));
        app.set('view engine', viewEngine);
        app.set('views', NajsFacade_1.NajsFacade.path(INajsFacade_1.NajsPath.View));
    }
    setupStaticAssets(app) {
        app.use(Express.static(NajsFacade_1.NajsFacade.path(INajsFacade_1.NajsPath.Public)));
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
            handlers.push(this.createBeforeMiddlewareWrapper(middlewareList));
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
    createBeforeMiddlewareWrapper(middlewareList) {
        return async (request, response, next) => {
            for (const middleware of middlewareList) {
                if (lodash_1.isFunction(middleware.before)) {
                    try {
                        await Reflect.apply(middleware.before, middleware, [request, response]);
                    }
                    catch (error) {
                        return next(error);
                    }
                }
            }
            next();
        };
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
            const controller = make_1.make(controllerName, [request, response]);
            const endpoint = Reflect.get(controller, endpointName);
            if (lodash_1.isFunction(endpoint)) {
                const result = Reflect.apply(endpoint, controller, [request, response]);
                await this.handleEndpointResult(request, response, result, middleware);
            }
        };
    }
    createEndpointWrapperByObject(controllerObject, endpointName, middleware) {
        return async (request, response) => {
            const controller = this.cloneControllerObject(controllerObject, request, response);
            const endpoint = Reflect.get(controller, endpointName);
            if (lodash_1.isFunction(endpoint)) {
                const result = Reflect.apply(endpoint, controller, [request, response]);
                await this.handleEndpointResult(request, response, result, middleware);
            }
        };
    }
    cloneControllerObject(controller, request, response) {
        if (controller instanceof Controller_1.Controller) {
            return make_1.make(controller.getClassName(), [request, response]);
        }
        return Object.assign({}, controller, { request, response });
    }
    createEndpointWrapperByFunction(endpoint, middleware) {
        return async (request, response) => {
            // Can not use make for default ExpressController
            const controller = Reflect.construct(ExpressController_1.ExpressController, [request, response]);
            const result = Reflect.apply(endpoint, controller, [request, response]);
            await this.handleEndpointResult(request, response, result, middleware);
        };
    }
    async applyAfterMiddlewareWrapper(middlewareList, request, response, value) {
        if (middlewareList.length === 0) {
            return value;
        }
        let result = value;
        for (const middleware of middlewareList) {
            if (lodash_1.isFunction(middleware.after)) {
                result = await Reflect.apply(middleware.after, middleware, [request, response, result]);
            }
        }
        return result;
    }
    async handleEndpointResult(request, response, result, middleware) {
        const rawValue = isPromise_1.isPromise(result) ? await result : result;
        const value = await this.applyAfterMiddlewareWrapper(middleware, request, response, rawValue);
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
