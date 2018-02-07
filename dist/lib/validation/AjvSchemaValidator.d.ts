import { ISchemaValidator } from './ISchemaValidator';
import { IAutoload } from '../core/IAutoload';
import * as Ajv from 'ajv';
export declare class AjvSchemaValidator implements ISchemaValidator, IAutoload {
    static className: string;
    protected ajv: Ajv.Ajv;
    constructor();
    getClassName(): string;
    getSchema<T extends any>(schemaId: string): T;
    addSchema<T extends any>(schemaId: string, schema: T): this;
    removeSchema(schemaId: string): this;
    getKeyword<T extends any>(name: string): T;
    addKeyword<T extends any>(name: string, definition: T): this;
    removeKeyword(name: string): this;
    addFormat<T extends any>(name: string, formatter: T): this;
    /**
     * Gets a schema by schema id, an alias of .getSchema()
     *
     * @param {string} schemaId - schema id
     */
    schema<T extends any>(schemaId: string): T;
    /**
     * Registers a schema with id, an alias of .addSchema()
     *
     * @param {string} schemaId - schema id
     */
    schema<T extends any>(schemaId: string, schema: T): this;
    /**
     * Gets a keyword by name, an alias of .getKeyword()
     *
     * @param {string} name - keyword name
     */
    keyword<T extends any>(name: string): T;
    /**
     * Registers a keyword with name, an alias of .addKeyword()
     *
     * @param {string} schemaId - keyword name
     */
    keyword<T extends any>(name: string, definition: T): this;
    /**
     * Registers a format with name, an alias of .addFormat()
     *
     * @param {string} name - format name
     */
    format<T extends any>(name: string, formatter: T): this;
}
