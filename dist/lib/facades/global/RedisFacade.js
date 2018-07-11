"use strict";
/// <reference path="../../contracts/Redis.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("../../redis/RedisClient");
const najs_facade_1 = require("najs-facade");
const Najs_1 = require("../../core/Najs");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const facade = najs_facade_1.Facade.create(Najs_1.Najs, 'redis', function () {
    return najs_binding_1.make(constants_1.Najs.Redis.RedisClient);
});
exports.Redis = facade;
exports.RedisFacade = facade;
