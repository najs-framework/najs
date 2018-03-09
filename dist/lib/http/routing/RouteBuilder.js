"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpMethod_1 = require("../HttpMethod");
const lodash_1 = require("lodash");
const RouteData_1 = require("./RouteData");
/**
 * Route syntax implementation
 */
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
        }
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
    all(arg0, arg1, arg2) {
        return this.method('all', arg0, arg1, arg2);
    }
    checkout(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.CHECKOUT, arg0, arg1, arg2);
    }
    copy(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.COPY, arg0, arg1, arg2);
    }
    delete(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.DELETE, arg0, arg1, arg2);
    }
    get(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.GET, arg0, arg1, arg2);
    }
    head(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.HEAD, arg0, arg1, arg2);
    }
    lock(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.LOCK, arg0, arg1, arg2);
    }
    merge(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.MERGE, arg0, arg1, arg2);
    }
    mkactivity(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.MKACTIVITY, arg0, arg1, arg2);
    }
    mkcol(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.MKCOL, arg0, arg1, arg2);
    }
    move(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.MOVE, arg0, arg1, arg2);
    }
    msearch(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.M_SEARCH, arg0, arg1, arg2);
    }
    notify(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.NOTIFY, arg0, arg1, arg2);
    }
    options(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.OPTIONS, arg0, arg1, arg2);
    }
    patch(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.PATCH, arg0, arg1, arg2);
    }
    post(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.POST, arg0, arg1, arg2);
    }
    purge(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.PURGE, arg0, arg1, arg2);
    }
    put(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.PUT, arg0, arg1, arg2);
    }
    report(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.REPORT, arg0, arg1, arg2);
    }
    search(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.SEARCH, arg0, arg1, arg2);
    }
    subscribe(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.SUBSCRIBE, arg0, arg1, arg2);
    }
    trace(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.TRACE, arg0, arg1, arg2);
    }
    unlock(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.UNLOCK, arg0, arg1, arg2);
    }
    unsubscribe(arg0, arg1, arg2) {
        return this.method(HttpMethod_1.HttpMethod.UNSUBSCRIBE, arg0, arg1, arg2);
    }
}
exports.RouteBuilder = RouteBuilder;
