"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function get_class_name(classDefinition, allowString = true) {
    if (allowString && lodash_1.isString(classDefinition)) {
        return classDefinition;
    }
    if (lodash_1.isFunction(classDefinition.prototype.getClassName)) {
        return classDefinition.prototype.getClassName.call(classDefinition);
    }
    if (lodash_1.isString(classDefinition.className)) {
        return classDefinition.className;
    }
    throw new TypeError('Please define "className" or "getClassName" for ' + classDefinition);
}
exports.get_class_name = get_class_name;
//# sourceMappingURL=get_class_name.js.map