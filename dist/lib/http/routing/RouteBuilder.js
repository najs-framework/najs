"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpMethod_1 = require("./../HttpMethod");
/**
 * Route syntax implementation
 */
class RouteBuilder {
    constructor(method, path) {
        this.data = {
            name: '',
            method: method || HttpMethod_1.HttpMethod.GET,
            path: path || '',
            prefix: '',
            controller: '',
            endpoint: '',
            middleware: []
        };
        this.children = [];
    }
    getRouteData() {
        // const result: IRouteData[] = []
        return this.data;
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
    use(middleware) {
        // this.data.middleware.push(middleware)
        return this;
    }
    middleware(middleware) {
        this.data.middleware.push(middleware);
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
    get(path) {
        this.data.method = 'GET';
        this.data.path = path;
        return this;
    }
    // post(path: string): RouteGrammarVerbChain {
    //   this.data.method = 'POST'
    //   this.data.path = path
    //   return this
    // }
    method(method) {
        return this;
    }
}
exports.RouteBuilder = RouteBuilder;
//# sourceMappingURL=RouteBuilder.js.map