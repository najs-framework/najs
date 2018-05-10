"use strict";
/// <reference path="../../contracts/types/routing.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const HttpMethod_1 = require("../HttpMethod");
const lodash_1 = require("lodash");
const RouteData_1 = require("./RouteData");
// implements IRouteGrammarVerbs implicitly
class RouteBuilder {
    constructor(method, path) {
        this.data = new RouteData_1.RouteData(method, path);
        this.children = [];
    }
    getRouteData(parent) {
        if (this.children.length === 0) {
            const data = this.data.getData(parent);
            return data ? [data] : [];
        }
        const result = this.children.map(item => {
            this.data.mergeParentData(parent);
            return item.getRouteData(this.data);
        });
        return lodash_1.flatten(result);
    }
    registerChildRoute(route) {
        if (this.children.length === 0) {
            this.children.push(route);
            return;
        }
        const lastChild = this.children[this.children.length - 1];
        if (lastChild.shouldRegisterChildRoute()) {
            lastChild.registerChildRoute(route);
            return;
        }
        this.children.push(route);
    }
    shouldRegisterChildRoute() {
        if (!this.data.metadata) {
            return false;
        }
        return this.data.metadata['grouped'] === true;
    }
    hasChildRoute() {
        return this.children.length !== 0;
    }
    // -------------------------------------------------------------------------------------------------------------------
    use(...list) {
        return this.middleware(...list);
    }
    middleware(...list) {
        for (const middleware of list) {
            if (Array.isArray(middleware)) {
                this.data.middleware = this.data.middleware.concat(middleware.filter(item => lodash_1.isString(item) || lodash_1.isObject(item) || lodash_1.isFunction(item)));
                continue;
            }
            if (lodash_1.isString(middleware) || lodash_1.isObject(middleware) || lodash_1.isFunction(middleware)) {
                this.data.middleware.push(middleware);
                continue;
            }
        }
        return this;
    }
    prefix(prefix) {
        this.data.prefix = prefix;
        return this;
    }
    group(callback) {
        if (!this.data.metadata) {
            this.data.metadata = {};
        }
        this.data.metadata['grouped'] = true;
        callback.call(undefined);
        delete this.data.metadata['grouped'];
        return this;
    }
    name(name) {
        this.data.name = name;
        return this;
    }
    method(method, path, arg0, arg1) {
        this.data.method = method;
        this.data.path = path;
        if (typeof arg1 === 'undefined') {
            return this.method_overload_3_params(method, path, arg0);
        }
        return this.method_overload_4_params(method, path, arg0, arg1);
    }
    method_overload_3_params(method, path, arg0) {
        if (lodash_1.isString(arg0)) {
            const parts = arg0.split('@');
            if (parts.length !== 2) {
                throw new Error('Target "' + arg0 + '" is invalid. Correct format: ControllerName@endpointName');
            }
            this.data.controller = parts[0];
            this.data.endpoint = parts[1];
            return this;
        }
        if (lodash_1.isFunction(arg0)) {
            this.data.endpoint = arg0;
            return this;
        }
        throw new TypeError('Invalid Route');
    }
    method_overload_4_params(method, path, arg0, arg1) {
        if (lodash_1.isFunction(arg0)) {
            if (!lodash_1.isFunction(Reflect.get(arg0.prototype, arg1))) {
                throw new ReferenceError('Endpoint ' + arg1 + ' not found');
            }
            this.data.controller = arg0;
            this.data.endpoint = arg1;
            return this;
        }
        if (lodash_1.isObject(arg0)) {
            if (!lodash_1.isFunction(Reflect.get(arg0, arg1))) {
                throw new ReferenceError('Endpoint ' + arg1 + ' not found');
            }
            this.data.controller = arg0;
            this.data.endpoint = arg1;
            return this;
        }
        throw new TypeError('Invalid Route');
    }
}
exports.RouteBuilder = RouteBuilder;
const HTTP_VERBS = {
    all: 'all',
    checkout: HttpMethod_1.HttpMethod.CHECKOUT,
    copy: HttpMethod_1.HttpMethod.COPY,
    delete: HttpMethod_1.HttpMethod.DELETE,
    get: HttpMethod_1.HttpMethod.GET,
    head: HttpMethod_1.HttpMethod.HEAD,
    lock: HttpMethod_1.HttpMethod.LOCK,
    merge: HttpMethod_1.HttpMethod.MERGE,
    mkactivity: HttpMethod_1.HttpMethod.MKACTIVITY,
    mkcol: HttpMethod_1.HttpMethod.MKCOL,
    move: HttpMethod_1.HttpMethod.MOVE,
    msearch: HttpMethod_1.HttpMethod.M_SEARCH,
    notify: HttpMethod_1.HttpMethod.NOTIFY,
    options: HttpMethod_1.HttpMethod.OPTIONS,
    patch: HttpMethod_1.HttpMethod.PATCH,
    post: HttpMethod_1.HttpMethod.POST,
    purge: HttpMethod_1.HttpMethod.PURGE,
    put: HttpMethod_1.HttpMethod.PUT,
    report: HttpMethod_1.HttpMethod.REPORT,
    search: HttpMethod_1.HttpMethod.SEARCH,
    subscribe: HttpMethod_1.HttpMethod.SUBSCRIBE,
    trace: HttpMethod_1.HttpMethod.TRACE,
    unlock: HttpMethod_1.HttpMethod.UNLOCK,
    unsubscribe: HttpMethod_1.HttpMethod.UNSUBSCRIBE
};
// implements IRouteGrammarVerbs
for (const name in HTTP_VERBS) {
    RouteBuilder.prototype[name] = function (arg0, arg1, arg2) {
        return this.method(HTTP_VERBS[name], arg0, arg1, arg2);
    };
}
