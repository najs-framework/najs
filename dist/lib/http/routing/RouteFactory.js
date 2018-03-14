"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../constants");
const RouteCollection_1 = require("./RouteCollection");
const RouteBuilder_1 = require("./RouteBuilder");
const PathToRegex = require("path-to-regexp");
// implements IRouteFactory implicitly
class RouteFactory extends najs_facade_1.Facade {
    constructor() {
        super();
        return this.createProxy();
    }
    createProxy() {
        this.proxy = new Proxy(this, {
            get(target, key) {
                if (key !== 'hasOwnProperty' && typeof RouteBuilder_1.RouteBuilder.prototype[key] === 'function') {
                    return function () {
                        return RouteCollection_1.RouteCollection.register(new RouteBuilder_1.RouteBuilder())[key](...arguments);
                    };
                }
                return target[key];
            }
        });
        return this.proxy;
    }
    getClassName() {
        return constants_1.GlobalFacadeClass.Route;
    }
    createByName(name, param, options) {
        const route = RouteCollection_1.RouteCollection.findOrFail(name);
        const toPath = PathToRegex.compile(route.prefix + route.path);
        return toPath(param, options);
    }
}
exports.RouteFactory = RouteFactory;
najs_binding_1.register(RouteFactory);
