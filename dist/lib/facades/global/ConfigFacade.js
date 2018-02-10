"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = require("../Facade");
const Config_1 = require("../../../lib/config/Config");
const Najs_1 = require("../../../lib/core/Najs");
exports.ConfigFacade = Facade_1.Facade.create(Najs_1.Najs, 'config', function () {
    return new Config_1.Config();
});
