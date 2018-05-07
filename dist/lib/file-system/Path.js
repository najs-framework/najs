"use strict";
/// <reference path="../contracts/Path.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const ConfigFacade_1 = require("../facades/global/ConfigFacade");
const constants_1 = require("../constants");
const SystemPath = require("path");
const Najs_1 = require("../core/Najs");
const NajsPaths = {
    app: 'app',
    config: 'config',
    layout: SystemPath.join('resources', 'view', 'layout'),
    public: 'public',
    resource: 'resources',
    route: 'routes',
    storage: SystemPath.join('app', 'storage'),
    view: SystemPath.join('resources', 'view')
};
class Path extends najs_facade_1.Facade {
    getClassName() {
        return constants_1.Najs.FileSystem.Path;
    }
    get(...args) {
        return this.cwd(...args);
    }
    cwd(...args) {
        return SystemPath.resolve(Najs_1.Najs['cwd'], ...args);
    }
}
Path.className = constants_1.Najs.FileSystem.Path;
exports.Path = Path;
for (const name in NajsPaths) {
    Path.prototype[name] = function (...args) {
        return this.cwd(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Paths[name], NajsPaths[name]), ...args);
    };
}
najs_binding_1.register(Path, constants_1.Najs.FileSystem.Path);
