"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteCollection_1 = require("./RouteCollection");
const RouteBuilder_1 = require("./RouteBuilder");
class Router {
    group(callback) {
        return this.register(new RouteBuilder_1.RouteBuilder('', '')).group(callback);
    }
    use(middleware) {
        return this.register(new RouteBuilder_1.RouteBuilder('', '')).use(middleware);
    }
    middleware(middleware) {
        return this.register(new RouteBuilder_1.RouteBuilder('', '')).middleware(middleware);
    }
    prefix(prefix) {
        return this.register(new RouteBuilder_1.RouteBuilder('', '')).prefix(prefix);
    }
    get(path, endpoint) {
        return this.register(new RouteBuilder_1.RouteBuilder('GET', path));
    }
    name(name) {
        return this.register(new RouteBuilder_1.RouteBuilder('', '')).name(name);
    }
    redirect(...args) { }
    register(route) {
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
exports.Router = Router;
//# sourceMappingURL=Router.js.map