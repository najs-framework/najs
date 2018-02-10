"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const Facade_1 = require("../facades/Facade");
const ConfigLib = require("config");
const register_1 = require("../core/register");
class Config extends Facade_1.Facade {
    constructor() {
        super(...arguments);
        this.config = ConfigLib;
    }
    getClassName() {
        return Config.className;
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
Config.className = constants_1.GlobalFacade.Config;
exports.Config = Config;
register_1.register(Config, constants_1.GlobalFacade.Config);
