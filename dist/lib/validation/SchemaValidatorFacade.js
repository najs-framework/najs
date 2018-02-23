"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const AjvSchemaValidator_1 = require("./AjvSchemaValidator");
exports.SchemaValidatorFacade = new AjvSchemaValidator_1.AjvSchemaValidator();
function reload() {
    exports.SchemaValidatorFacade = najs_binding_1.make(constants_1.SchemaValidatorClass);
    return exports.SchemaValidatorFacade;
}
exports.reload = reload;
