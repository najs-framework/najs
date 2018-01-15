"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("./register");
const lodash_1 = require("lodash");
function singleton(classDefinition, className, overridable) {
    if (typeof classDefinition === 'undefined' || lodash_1.isString(classDefinition)) {
        return function decorator(target) {
            register_1.register(target, classDefinition, false, true);
        };
    }
    return register_1.register(classDefinition, className, overridable, true);
}
exports.singleton = singleton;
//# sourceMappingURL=singleton.js.map