"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = require("../facades/Facade");
const ConfigLib = require("config");
class Config extends Facade_1.Facade {
    constructor() {
        super(...arguments);
        this.config = ConfigLib;
    }
    get(setting, defaultValue) {
        if (typeof defaultValue !== 'undefined' && !this.config.has(setting)) {
            return defaultValue;
        }
        return this.config.get(setting);
    }
    has(setting) {
        return this.config.has(setting);
    }
}
exports.Config = Config;
