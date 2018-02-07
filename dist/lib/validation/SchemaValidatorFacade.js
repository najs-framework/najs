"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = require("../core/make");
const constants_1 = require("../constants");
const AjvSchemaValidator_1 = require("./AjvSchemaValidator");
exports.SchemaValidatorFacade = new AjvSchemaValidator_1.AjvSchemaValidator();
function reload() {
    exports.SchemaValidatorFacade = make_1.make(constants_1.SchemaValidatorClass);
    return exports.SchemaValidatorFacade;
}
exports.reload = reload;
