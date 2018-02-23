"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const najs_binding_1 = require("najs-binding");
const Ajv = require("ajv");
class AjvSchemaValidator {
    constructor() {
        this.ajv = new Ajv();
    }
    getClassName() {
        return AjvSchemaValidator.className;
    }
    getSchema(schemaId) {
        return this.ajv.getSchema(schemaId);
    }
    addSchema(schemaId, schema) {
        this.ajv.addSchema(schema, schemaId);
        return this;
    }
    removeSchema(schemaId) {
        this.ajv.removeSchema(schemaId);
        return this;
    }
    getKeyword(name) {
        return this.ajv.getKeyword(name);
    }
    addKeyword(name, definition) {
        this.ajv.addKeyword(name, definition);
        return this;
    }
    removeKeyword(name) {
        this.ajv.removeKeyword(name);
        return this;
    }
    addFormat(name, formatter) {
        this.ajv.addFormat(name, formatter);
        return this;
    }
    schema(schemaId, schema) {
        if (typeof schema === 'undefined') {
            return this.getSchema(schemaId);
        }
        return this.addSchema(schemaId, schema);
    }
    keyword(name, definition) {
        if (typeof definition === 'undefined') {
            return this.getKeyword(name);
        }
        return this.addKeyword(name, definition);
    }
    /**
     * Registers a format with name, an alias of .addFormat()
     *
     * @param {string} name - format name
     */
    format(name, formatter) {
        return this.addFormat(name, formatter);
    }
}
AjvSchemaValidator.className = 'AjvSchemaValidator';
exports.AjvSchemaValidator = AjvSchemaValidator;
najs_binding_1.register(AjvSchemaValidator);
najs_binding_1.register(AjvSchemaValidator, constants_1.SchemaValidatorClass);
