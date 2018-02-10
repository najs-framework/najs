"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = require("../Facade");
const Application_1 = require("../../../lib/core/Application");
const Najs_1 = require("../../../lib/core/Najs");
exports.AppFacade = Facade_1.Facade.create(Najs_1.Najs, 'app', function () {
    return new Application_1.Application();
});
