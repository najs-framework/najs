"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RouteBuilder = /** @class */ (function () {
    function RouteBuilder(method, path) {
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
    RouteBuilder.prototype.getRouteData = function () {
        return this.data;
    };
    RouteBuilder.prototype.registerChildRoute = function (route) { };
    RouteBuilder.prototype.shouldRegisterChildRoute = function () {
        return false;
    };
    RouteBuilder.prototype.hasChildRoute = function () {
        return false;
    };
    // -------------------------------------------------------------------------------------------------------------------
    RouteBuilder.prototype.name = function (name) {
        this.data.name = name;
        return this;
    };
    RouteBuilder.prototype.validateInput = function () {
        return this;
    };
    return RouteBuilder;
}());
exports.RouteBuilder = RouteBuilder;
//# sourceMappingURL=RouteBuilder.js.map