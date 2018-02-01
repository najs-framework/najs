"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = require("./make");
const register_1 = require("./register");
const bind_1 = require("./bind");
const constants_1 = require("../constants");
const lodash_1 = require("lodash");
const INajsFacade_1 = require("./INajsFacade");
const Path = require("path");
const Config = require("config");
const NajsDefaultOptions = {
    port: 3000
};
class Najs {
    constructor() {
        this.config = Config;
        this.options = NajsDefaultOptions;
    }
    assert_config_is_registered_before_using() {
        if (!this.config) {
            throw new ReferenceError('Please register config instance firstly: Najs.use(require("config"))');
        }
    }
    use(configOrOptions) {
        if (lodash_1.isFunction(configOrOptions['get']) && lodash_1.isFunction(configOrOptions['has'])) {
            this.config = configOrOptions;
            const optionsInConfig = Object.keys(constants_1.ConfigurationKeys.NajsOptions).reduce((memo, key) => {
                memo[key] = this.getConfig(constants_1.ConfigurationKeys.NajsOptions[key], false);
                return memo;
            }, {});
            this.options = Object.assign({}, NajsDefaultOptions, lodash_1.pickBy(optionsInConfig));
        }
        else {
            this.options = Object.assign({}, NajsDefaultOptions, configOrOptions);
        }
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
    hasConfig(setting) {
        this.assert_config_is_registered_before_using();
        return this.config.has(setting);
    }
    getConfig(setting, defaultValue) {
        this.assert_config_is_registered_before_using();
        if (typeof defaultValue === 'undefined') {
            return this.config.get(setting);
        }
        if (this.hasConfig(setting)) {
            return this.config.get(setting);
        }
        return defaultValue;
    }
    path(...args) {
        // given that najs installed in node_modules so the path to this file is
        //   ~/node_modules/najs/dist/lib/core/NajsFacade.js
        const cwd = this.getConfig(constants_1.ConfigurationKeys.CWD, Path.join(__dirname, '..', '..', '..', '..'));
        if (arguments.length === 0) {
            return cwd;
        }
        const [firstPath, ...paths] = args;
        let based = '';
        switch (firstPath) {
            case INajsFacade_1.NajsPath.App:
                based = Path.join(cwd, this.getConfig(constants_1.ConfigurationKeys.Paths.app, 'app'));
                break;
            case INajsFacade_1.NajsPath.Base:
                based = Path.join(cwd, this.getConfig(constants_1.ConfigurationKeys.Paths.base, ''));
                break;
            case INajsFacade_1.NajsPath.Config:
                based = Path.join(cwd, this.getConfig(constants_1.ConfigurationKeys.Paths.config, 'config'));
                break;
            case INajsFacade_1.NajsPath.Layout:
                based = Path.join(cwd, this.getConfig(constants_1.ConfigurationKeys.Paths.layout, Path.join('resources', 'view', 'layout')));
                break;
            case INajsFacade_1.NajsPath.Public:
                based = Path.join(cwd, this.getConfig(constants_1.ConfigurationKeys.Paths.public, 'public'));
                break;
            case INajsFacade_1.NajsPath.Resource:
                based = Path.join(cwd, this.getConfig(constants_1.ConfigurationKeys.Paths.resource, 'resources'));
                break;
            case INajsFacade_1.NajsPath.Route:
                based = Path.join(cwd, this.getConfig(constants_1.ConfigurationKeys.Paths.route, 'routes'));
                break;
            case INajsFacade_1.NajsPath.Storage:
                based = Path.join(cwd, this.getConfig(constants_1.ConfigurationKeys.Paths.storage, Path.join('app', 'storage')));
                break;
            case INajsFacade_1.NajsPath.View:
                based = Path.join(cwd, this.getConfig(constants_1.ConfigurationKeys.Paths.view, Path.join('resources', 'view')));
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
exports.NajsFacade = new Najs();
