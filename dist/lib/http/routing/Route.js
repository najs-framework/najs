"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteCollection_1 = require("./RouteCollection");
const RouteBuilder_1 = require("./RouteBuilder");
const PathToRegex = require("path-to-regexp");
class Route {
    createByName(name, param, options) {
        const route = RouteCollection_1.RouteCollection.findOrFail(name);
        const toPath = PathToRegex.compile(route.prefix + route.path);
        return toPath(param, options);
    }
    // redirect(...args: Array<any>): void {}
    group(callback) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).group(callback);
    }
    use(...list) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).use(...list);
    }
    middleware(...list) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).middleware(...list);
    }
    prefix(prefix) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).prefix(prefix);
    }
    name(name) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).name(name);
    }
    method(arg0, arg1, arg2, arg3) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).method(arg0, arg1, arg2, arg3);
    }
    all(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).all(arg0, arg1, arg2);
    }
    checkout(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).checkout(arg0, arg1, arg2);
    }
    copy(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).copy(arg0, arg1, arg2);
    }
    delete(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).delete(arg0, arg1, arg2);
    }
    get(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).get(arg0, arg1, arg2);
    }
    head(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).head(arg0, arg1, arg2);
    }
    lock(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).lock(arg0, arg1, arg2);
    }
    merge(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).merge(arg0, arg1, arg2);
    }
    mkactivity(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).mkactivity(arg0, arg1, arg2);
    }
    mkcol(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).mkcol(arg0, arg1, arg2);
    }
    move(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).move(arg0, arg1, arg2);
    }
    msearch(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).msearch(arg0, arg1, arg2);
    }
    notify(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).notify(arg0, arg1, arg2);
    }
    options(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).options(arg0, arg1, arg2);
    }
    patch(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).patch(arg0, arg1, arg2);
    }
    post(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).post(arg0, arg1, arg2);
    }
    purge(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).purge(arg0, arg1, arg2);
    }
    put(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).put(arg0, arg1, arg2);
    }
    report(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).report(arg0, arg1, arg2);
    }
    search(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).search(arg0, arg1, arg2);
    }
    subscribe(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).subscribe(arg0, arg1, arg2);
    }
    trace(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).trace(arg0, arg1, arg2);
    }
    unlock(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).unlock(arg0, arg1, arg2);
    }
    unsubscribe(arg0, arg1, arg2) {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder()).unsubscribe(arg0, arg1, arg2);
    }
}
exports.Route = Route;
