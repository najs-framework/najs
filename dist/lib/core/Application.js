"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const Facade_1 = require("../facades/Facade");
const constants_1 = require("../constants");
class Application extends Facade_1.Facade {
    getClassName() {
        return Application.className;
    }
    make(className) {
        return najs_binding_1.make(className);
    }
    makeWith(className, data) {
        return najs_binding_1.make(className, data);
    }
    register(classDefinition, className, overridable, singleton) {
        najs_binding_1.register(classDefinition, className, overridable, singleton);
        return this;
    }
    bind(abstract, concrete) {
        najs_binding_1.bind(abstract, concrete);
        return this;
    }
    extend(abstract, decorator) {
        najs_binding_1.extend(abstract, decorator);
        return this;
    }
}
Application.className = constants_1.GlobalFacadeClass.Application;
exports.Application = Application;
najs_binding_1.register(Application, constants_1.GlobalFacadeClass.Application);
