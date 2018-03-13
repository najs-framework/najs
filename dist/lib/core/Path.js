"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const ConfigFacade_1 = require("../facades/global/ConfigFacade");
const constants_1 = require("../constants");
const SystemPath = require("path");
const Najs_1 = require("./Najs");
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
// IPath is implements implicitly to reduce repetition
class PathClass extends najs_facade_1.Facade {
    getClassName() {
        return PathClass.className;
    }
    get(...args) {
        return this.cwd(...args);
    }
    cwd(...args) {
        return SystemPath.resolve(Najs_1.Najs['cwd'], ...args);
    }
}
PathClass.className = constants_1.GlobalFacadeClass.Path;
for (const name in NajsPaths) {
    PathClass.prototype[name] = function (...args) {
        return this.cwd(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Paths[name], NajsPaths[name]), ...args);
    };
}
najs_binding_1.register(PathClass, constants_1.GlobalFacadeClass.Path);
exports.Path = PathClass;
