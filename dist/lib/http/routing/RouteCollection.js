"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class RouteCollection {
    static getData() {
        const result = this.routes.map(route => route.getRouteData());
        return lodash_1.flatten(result);
    }
}
RouteCollection.routes = [];
exports.RouteCollection = RouteCollection;
