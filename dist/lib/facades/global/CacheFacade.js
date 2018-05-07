"use strict";
/// <reference path="../../contracts/Cache.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../lib/cache/RedisCache");
const najs_facade_1 = require("najs-facade");
const Najs_1 = require("../../../lib/core/Najs");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const facade = najs_facade_1.Facade.create(Najs_1.Najs, 'cache', function () {
    return najs_binding_1.make(constants_1.Najs.Cache.RedisCache);
});
exports.Cache = facade;
exports.CacheFacade = facade;
