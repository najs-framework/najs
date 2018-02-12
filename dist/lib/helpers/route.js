"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteFacade_1 = require("../facades/global/RouteFacade");
function route(name, param, options) {
    return RouteFacade_1.RouteFacade.createByName(name, param, options);
}
exports.route = route;
