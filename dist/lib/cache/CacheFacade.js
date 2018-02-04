"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = require("../core/make");
const NajsFacade_1 = require("../core/NajsFacade");
const constants_1 = require("../constants");
exports.CacheFacade = make_1.make(NajsFacade_1.NajsFacade.getConfig(constants_1.ConfigurationKeys.Cache.engine, constants_1.CacheClass));
function reload() {
    exports.CacheFacade = make_1.make(NajsFacade_1.NajsFacade.getConfig(constants_1.ConfigurationKeys.Cache.engine));
    return exports.CacheFacade;
}
exports.reload = reload;
