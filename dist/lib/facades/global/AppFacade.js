"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../lib/core/Application");
const najs_facade_1 = require("najs-facade");
const Najs_1 = require("../../../lib/core/Najs");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const facade = najs_facade_1.Facade.create(Najs_1.Najs, 'app', function () {
    return najs_binding_1.make(constants_1.GlobalFacadeClass.Application);
});
exports.App = facade;
exports.AppFacade = facade;
