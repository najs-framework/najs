"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
// type RoutingOptions = {
//   duplicatedNameWarning: boolean
// }
// const DEFAULT_ROUTING_OPTIONS: RoutingOptions = {
//   duplicatedNameWarning: true
// }
class RouteCollection {
    static getData() {
        if (this.isChanged) {
            const result = this.routes.map(route => route.getRouteData());
            this.routeData = lodash_1.flatten(result);
            this.routeDataNamed = this.routeData.reduce((memo, item) => {
                if (item.name) {
                    // if (typeof memo[item.name] !== 'undefined' && this.options.duplicatedNameWarning) {
                    // Logger.warn('Duplicated named')
                    // }
                    memo[item.name] = item;
                }
                return memo;
            }, {});
            this.isChanged = false;
        }
        return this.routeData;
    }
    static register(route) {
        this.isChanged = true;
        if (this.routes.length === 0) {
            this.routes.push(route);
            return route;
        }
        const lastRoute = this.routes[this.routes.length - 1];
        if (lastRoute.shouldRegisterChildRoute()) {
            lastRoute.registerChildRoute(route);
            return route;
        }
        this.routes.push(route);
        return route;
    }
    static hasName(name) {
        return typeof this.routeDataNamed[name] !== 'undefined';
    }
    static findOrFail(name) {
        this.getData();
        if (!this.hasName(name)) {
            throw new Error('Route "' + name + '" not found');
        }
        return this.routeDataNamed[name];
    }
}
// private static options: RoutingOptions = DEFAULT_ROUTING_OPTIONS
RouteCollection.isChanged = false;
RouteCollection.routes = [];
RouteCollection.routeData = [];
RouteCollection.routeDataNamed = {};
exports.RouteCollection = RouteCollection;
