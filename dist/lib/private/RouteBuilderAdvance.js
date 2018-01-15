"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteBuilder_1 = require("./RouteBuilder");
class RouteBuilderAdvance extends RouteBuilder_1.RouteBuilder {
    constructor(method, path) {
        super(method, path);
        this.children = [];
    }
    getRouteData() {
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
        return this.children.length === 0;
    }
    // -------------------------------------------------------------------------------------------------------------------
    middleware(middleware) {
        this.data.middleware.push(middleware);
        return this;
    }
    prefix(prefix) {
        this.data.prefix = prefix;
        return this;
    }
    get(path) {
        this.data.method = 'GET';
        this.data.path = path;
        return this;
    }
    post(path) {
        this.data.method = 'POST';
        this.data.path = path;
        return this;
    }
    group(callback) {
        if (!this.data.metadata) {
            this.data.metadata = {};
        }
        this.data.metadata['grouped'] = true;
        callback.call(undefined);
        delete this.data.metadata['grouped'];
    }
}
exports.RouteBuilderAdvance = RouteBuilderAdvance;
//# sourceMappingURL=RouteBuilderAdvance.js.map