"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteCollection_1 = require("./RouteCollection");
const RouteBuilder_1 = require("./RouteBuilder");
class Router {
    // redirect(...args: Array<any>): void {}
    group(callback) {
        return this.register(new RouteBuilder_1.RouteBuilder('', '')).group(callback);
    }
    use(...list) {
        return this.register(new RouteBuilder_1.RouteBuilder()).use(...list);
    }
    middleware(...list) {
        return this.register(new RouteBuilder_1.RouteBuilder()).middleware(...list);
    }
    prefix(prefix) {
        return this.register(new RouteBuilder_1.RouteBuilder()).prefix(prefix);
    }
    name(name) {
        return this.register(new RouteBuilder_1.RouteBuilder()).name(name);
    }
    method(arg0, arg1, arg2, arg3) {
        return this.register(new RouteBuilder_1.RouteBuilder()).method(arg0, arg1, arg2, arg3);
    }
    all(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).all(arg0, arg1, arg2);
    }
    checkout(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).checkout(arg0, arg1, arg2);
    }
    copy(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).copy(arg0, arg1, arg2);
    }
    delete(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).delete(arg0, arg1, arg2);
    }
    get(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).get(arg0, arg1, arg2);
    }
    head(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).head(arg0, arg1, arg2);
    }
    lock(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).lock(arg0, arg1, arg2);
    }
    merge(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).merge(arg0, arg1, arg2);
    }
    mkactivity(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).mkactivity(arg0, arg1, arg2);
    }
    mkcol(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).mkcol(arg0, arg1, arg2);
    }
    move(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).move(arg0, arg1, arg2);
    }
    msearch(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).msearch(arg0, arg1, arg2);
    }
    notify(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).notify(arg0, arg1, arg2);
    }
    options(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).options(arg0, arg1, arg2);
    }
    patch(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).patch(arg0, arg1, arg2);
    }
    post(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).post(arg0, arg1, arg2);
    }
    purge(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).purge(arg0, arg1, arg2);
    }
    put(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).put(arg0, arg1, arg2);
    }
    report(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).report(arg0, arg1, arg2);
    }
    search(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).search(arg0, arg1, arg2);
    }
    subscribe(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).subscribe(arg0, arg1, arg2);
    }
    trace(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).trace(arg0, arg1, arg2);
    }
    unlock(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).unlock(arg0, arg1, arg2);
    }
    unsubscribe(arg0, arg1, arg2) {
        return this.register(new RouteBuilder_1.RouteBuilder()).unsubscribe(arg0, arg1, arg2);
    }
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
