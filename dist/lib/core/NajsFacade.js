"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = require("./make");
const register_1 = require("./register");
const bind_1 = require("./bind");
const constants_1 = require("../constants");
const lodash_1 = require("lodash");
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
    start(arg) {
        if (arg) {
            this.use(arg);
        }
        const httpDriver = make_1.make(constants_1.HttpDriverClass);
        httpDriver.start(this.options);
    }
}
exports.NajsFacade = new Najs();
