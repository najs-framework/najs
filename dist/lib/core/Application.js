"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = require("./make");
const register_1 = require("./register");
const bind_1 = require("./bind");
const constants_1 = require("../constants");
const IApplication_1 = require("./IApplication");
const Path = require("path");
const DefaultOptions = {
    port: 3000
};
class Application {
    constructor() {
        this.options = DefaultOptions;
    }
    use(configOrOptions) {
        this.options = Object.assign({}, DefaultOptions, configOrOptions);
        return this;
    }
    make(className, data) {
        return make_1.make(className, data);
    }
    register(classDefinition, className, overridable, singleton) {
        register_1.register(classDefinition, className, overridable, singleton);
        return this;
    }
    bind(abstract, concrete) {
        bind_1.bind(abstract, concrete);
        return this;
    }
    path(...args) {
        // given that najs installed in node_modules so the path to this file is
        //   ~/node_modules/najs/dist/lib/core/NajsFacade.js
        const cwd = this.config.get(constants_1.ConfigurationKeys.CWD, Path.join(__dirname, '..', '..', '..', '..'));
        if (arguments.length === 0) {
            return cwd;
        }
        const [firstPath, ...paths] = args;
        let based = '';
        switch (firstPath) {
            case IApplication_1.AppPath.App:
                based = Path.join(cwd, this.config.get(constants_1.ConfigurationKeys.Paths.app, 'app'));
                break;
            case IApplication_1.AppPath.Base:
                based = Path.join(cwd, this.config.get(constants_1.ConfigurationKeys.Paths.base, ''));
                break;
            case IApplication_1.AppPath.Config:
                based = Path.join(cwd, this.config.get(constants_1.ConfigurationKeys.Paths.config, 'config'));
                break;
            case IApplication_1.AppPath.Layout:
                based = Path.join(cwd, this.config.get(constants_1.ConfigurationKeys.Paths.layout, Path.join('resources', 'view', 'layout')));
                break;
            case IApplication_1.AppPath.Public:
                based = Path.join(cwd, this.config.get(constants_1.ConfigurationKeys.Paths.public, 'public'));
                break;
            case IApplication_1.AppPath.Resource:
                based = Path.join(cwd, this.config.get(constants_1.ConfigurationKeys.Paths.resource, 'resources'));
                break;
            case IApplication_1.AppPath.Route:
                based = Path.join(cwd, this.config.get(constants_1.ConfigurationKeys.Paths.route, 'routes'));
                break;
            case IApplication_1.AppPath.Storage:
                based = Path.join(cwd, this.config.get(constants_1.ConfigurationKeys.Paths.storage, Path.join('app', 'storage')));
                break;
            case IApplication_1.AppPath.View:
                based = Path.join(cwd, this.config.get(constants_1.ConfigurationKeys.Paths.view, Path.join('resources', 'view')));
                break;
            default:
                based = Path.join(cwd, firstPath);
                break;
        }
        return Path.join(based, ...paths);
    }
    start(arg) {
        if (arg) {
            this.use(arg);
        }
        const httpDriver = make_1.make(constants_1.HttpDriverClass);
        httpDriver.start(this.options);
    }
}
exports.Application = Application;
