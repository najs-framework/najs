"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const ConfigFacade_1 = require("../facades/global/ConfigFacade");
const constants_1 = require("../constants");
const SystemPath = require("path");
const Najs_1 = require("./Najs");
class Path extends najs_facade_1.Facade {
    getClassName() {
        return Path.className;
    }
    get(...args) {
        return this.cwd(...args);
    }
    cwd(...args) {
        return SystemPath.resolve(Najs_1.Najs['cwd'], ...args);
    }
    app(...args) {
        return this.cwd(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Paths.app, 'app'), ...args);
    }
    config(...args) {
        return this.cwd(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Paths.config, 'config'), ...args);
    }
    layout(...args) {
        return this.cwd(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Paths.layout, SystemPath.join('resources', 'view', 'layout')), ...args);
    }
    public(...args) {
        return this.cwd(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Paths.public, 'public'), ...args);
    }
    resource(...args) {
        return this.cwd(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Paths.resource, 'resources'), ...args);
    }
    route(...args) {
        return this.cwd(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Paths.route, 'routes'), ...args);
    }
    storage(...args) {
        return this.cwd(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Paths.storage, SystemPath.join('app', 'storage')), ...args);
    }
    view(...args) {
        return this.cwd(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Paths.view, SystemPath.join('resources', 'view')), ...args);
    }
}
Path.className = constants_1.GlobalFacadeClass.Path;
exports.Path = Path;
najs_binding_1.register(Path, constants_1.GlobalFacadeClass.Path);
