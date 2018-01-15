"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_class_name_1 = require("../private/get_class_name");
const ClassRegistry_1 = require("./ClassRegistry");
function make(className, data) {
    return ClassRegistry_1.ClassRegistry.findOrFail(get_class_name_1.get_class_name(className)).make(data);
}
exports.make = make;
//# sourceMappingURL=make.js.map