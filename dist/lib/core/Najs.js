"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = require("./make");
const register_1 = require("./register");
const bind_1 = require("./bind");
const NajsDefaultOptions = {
    port: 3000,
    host: 'localhost',
    httpDriver: 'ExpressHttpDriver'
};
class Najs {
    static use(options) {
        this.options = Object.assign({}, NajsDefaultOptions, options);
        return Najs;
    }
    static make(className, data) {
        return make_1.make(className, data);
    }
    static register(classDefinition, className, overridable, singleton) {
        register_1.register(classDefinition, className, overridable, singleton);
        return this;
    }
    static bind(abstract, concrete) {
        bind_1.bind(abstract, concrete);
        return this;
    }
    static start(options) {
        if (options) {
            this.use(options);
        }
        const httpDriver = make_1.make(this.options.httpDriver);
        httpDriver.start(this.options);
    }
}
Najs.options = NajsDefaultOptions;
exports.Najs = Najs;
