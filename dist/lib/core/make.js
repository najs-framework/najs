"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_class_name_1 = require("../private/get_class_name");
const ClassRegistry_1 = require("./ClassRegistry");
// /**
//  * `make` a class instance from registered class's name with args for constructor
//  */
// export function make(classDefinition: any, args: any[]): any
// /**
//  * `make` a class instance from registered class's name with args for constructor
//  */
// export function make<T>(classDefinition: any, args: any[]): T
function make(className, data) {
    return ClassRegistry_1.ClassRegistry.findOrFail(get_class_name_1.get_class_name(className)).make(data);
}
exports.make = make;
