"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = require("./make");
const register_1 = require("./register");
const bind_1 = require("./bind");
const Facade_1 = require("../facades/Facade");
const constants_1 = require("../constants");
class Application extends Facade_1.Facade {
    getClassName() {
        return Application.className;
    }
    make(className) {
        return make_1.make(className);
    }
    makeWith(className, data) {
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
}
Application.className = constants_1.GlobalFacadeClass.Application;
exports.Application = Application;
register_1.register(Application, constants_1.GlobalFacadeClass.Application);
