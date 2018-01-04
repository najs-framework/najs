"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var get_class_name_1 = require("../private/get_class_name");
var ClassRegistryItem_1 = require("../private/ClassRegistryItem");
var ClassRegistry_1 = require("./ClassRegistry");
var lodash_1 = require("lodash");
function register(classDefinition, className, overridable, singleton) {
    if (typeof classDefinition === 'undefined' || lodash_1.isString(classDefinition)) {
        return function decorator(target) {
            register(target, classDefinition);
        };
    }
    var item = new ClassRegistryItem_1.ClassRegistryItem(className || get_class_name_1.get_class_name(classDefinition, false), classDefinition, undefined, undefined, overridable, singleton);
    ClassRegistry_1.ClassRegistry.register(item);
}
exports.register = register;
//# sourceMappingURL=register.js.map