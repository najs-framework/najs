"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteCollection_1 = require("./RouteCollection");
const RouteBuilder_1 = require("../private/RouteBuilder");
const RouteBuilderAdvance_1 = require("../private/RouteBuilderAdvance");
class Route {
    static group(callback) {
        // do nothing with group in Route
        callback.call(undefined);
    }
    static middleware(middleware) {
        return this.register(new RouteBuilderAdvance_1.RouteBuilderAdvance('', '')).middleware(middleware);
    }
    static prefix(prefix) {
        return this.register(new RouteBuilderAdvance_1.RouteBuilderAdvance('', '')).prefix(prefix);
    }
    static redirect(...args) { }
    static get(path) {
        return this.register(new RouteBuilder_1.RouteBuilder('GET', path));
    }
    static post(path) {
        return this.register(new RouteBuilder_1.RouteBuilder('POST', path));
    }
    static register(route) {
        if (RouteCollection_1.RouteCollection.routes.length === 0) {
            RouteCollection_1.RouteCollection.routes.push(route);
            return route;
        }
        const lastRoute = RouteCollection_1.RouteCollection.routes[RouteCollection_1.RouteCollection.routes.length - 1];
        if (lastRoute.shouldRegisterChildRoute()) {
            lastRoute.registerChildRoute(route);
            return route;
        }
        RouteCollection_1.RouteCollection.routes.push(route);
        return route;
    }
}
exports.Route = Route;
//# sourceMappingURL=Route.js.map