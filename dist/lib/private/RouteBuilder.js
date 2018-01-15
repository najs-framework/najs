"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RouteBuilder {
    constructor(method, path) {
        this.data = {
            name: '',
            method: method,
            path: path,
            prefix: '',
            controller: '',
            endpoint: '',
            middleware: []
        };
    }
    getRouteData() {
        return this.data;
    }
    registerChildRoute(route) { }
    shouldRegisterChildRoute() {
        return false;
    }
    hasChildRoute() {
        return false;
    }
    // -------------------------------------------------------------------------------------------------------------------
    name(name) {
        this.data.name = name;
        return this;
    }
    validateInput() {
        return this;
    }
}
exports.RouteBuilder = RouteBuilder;
//# sourceMappingURL=RouteBuilder.js.map