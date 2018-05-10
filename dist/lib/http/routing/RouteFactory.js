"use strict";
/// <reference path="../../contracts/RouteFactory.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../constants");
const RouteCollection_1 = require("./RouteCollection");
const RouteBuilder_1 = require("./RouteBuilder");
const PathToRegex = require("path-to-regexp");
class RouteFactory extends najs_facade_1.Facade {
    getClassName() {
        return constants_1.Najs.Http.RouteFactory;
    }
    createByName(name, param, options) {
        const route = RouteCollection_1.RouteCollection.findOrFail(name);
        const toPath = PathToRegex.compile(route.prefix + route.path);
        return toPath(param, options);
    }
}
RouteFactory.className = constants_1.Najs.Http.RouteFactory;
exports.RouteFactory = RouteFactory;
// implements Najs.Contracts.RouteFactory implicitly
const functions = ['use', 'middleware', 'prefix', 'group', 'name', 'method'].concat(RouteBuilder_1.RouteBuilder.HttpVerbsSupported);
for (const name of functions) {
    RouteFactory.prototype[name] = function () {
        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder())[name](...arguments);
    };
}
najs_binding_1.register(RouteFactory, constants_1.Najs.Http.RouteFactory);
