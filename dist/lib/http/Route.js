"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RouteCollection_1 = require("./RouteCollection");
var RouteBuilder_1 = require("../private/RouteBuilder");
var RouteBuilderAdvance_1 = require("../private/RouteBuilderAdvance");
var Route = /** @class */ (function () {
    function Route() {
    }
    Route.group = function (callback) {
        // do nothing with group in Route
        callback.call(undefined);
    };
    Route.middleware = function (middleware) {
        return this.register(new RouteBuilderAdvance_1.RouteBuilderAdvance('', '')).middleware(middleware);
    };
    Route.prefix = function (prefix) {
        return this.register(new RouteBuilderAdvance_1.RouteBuilderAdvance('', '')).prefix(prefix);
    };
    Route.redirect = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    Route.get = function (path) {
        return this.register(new RouteBuilder_1.RouteBuilder('GET', path));
    };
    Route.post = function (path) {
        return this.register(new RouteBuilder_1.RouteBuilder('POST', path));
    };
    Route.register = function (route) {
        if (RouteCollection_1.RouteCollection.routes.length === 0) {
            RouteCollection_1.RouteCollection.routes.push(route);
            return route;
        }
        var lastRoute = RouteCollection_1.RouteCollection.routes[RouteCollection_1.RouteCollection.routes.length - 1];
        if (lastRoute.shouldRegisterChildRoute()) {
            lastRoute.registerChildRoute(route);
            return route;
        }
        RouteCollection_1.RouteCollection.routes.push(route);
        return route;
    };
    return Route;
}());
exports.Route = Route;
//# sourceMappingURL=Route.js.map