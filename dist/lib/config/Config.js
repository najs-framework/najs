"use strict";
/// <reference path="../contracts/Config.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const najs_facade_1 = require("najs-facade");
const ConfigLib = require("config");
const najs_binding_1 = require("najs-binding");
class Config extends najs_facade_1.Facade {
    constructor() {
        super(...arguments);
        this.config = ConfigLib;
    }
    getClassName() {
        return constants_1.Najs.Config;
    }
    get(name, defaultValue) {
        if (typeof defaultValue !== 'undefined' && !this.config.has(name)) {
            return defaultValue;
        }
        return this.config.get(name);
    }
    has(setting) {
        return this.config.has(setting);
    }
}
Config.className = constants_1.Najs.Config;
exports.Config = Config;
najs_binding_1.register(Config, constants_1.Najs.Config);
