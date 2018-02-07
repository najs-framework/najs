import { ISchemaValidator } from './ISchemaValidator'
import { SchemaValidatorClass } from '../constants'
import { register } from '../core/register'
import { IAutoload } from '../core/IAutoload'
import * as Ajv from 'ajv'

export class AjvSchemaValidator implements ISchemaValidator, IAutoload {
  static className: string = 'AjvSchemaValidator'

  protected ajv: Ajv.Ajv

  constructor() {
    this.ajv = new Ajv()
  }

  getClassName() {
    return AjvSchemaValidator.className
  }

  getSchema<T extends any>(schemaId: string): T {
    return <any>this.ajv.getSchema(schemaId)
  }

  addSchema<T extends any>(schemaId: string, schema: T): this {
    this.ajv.addSchema(schema, schemaId)
    return this
  }

  removeSchema(schemaId: string): this {
    this.ajv.removeSchema(schemaId)
    return this
  }

  getKeyword<T extends any>(name: string): T {
    return <any>this.ajv.getKeyword(name)
  }

  addKeyword<T extends any>(name: string, definition: T): this {
    this.ajv.addKeyword(name, definition)
    return this
  }

  removeKeyword(name: string): this {
    this.ajv.removeKeyword(name)
    return this
  }

  addFormat<T extends any>(name: string, formatter: T): this {
    this.ajv.addFormat(name, <any>formatter)
    return this
  }

  /**
   * Gets a schema by schema id, an alias of .getSchema()
   *
   * @param {string} schemaId - schema id
   */
  schema<T extends any>(schemaId: string): T
  /**
   * Registers a schema with id, an alias of .addSchema()
   *
   * @param {string} schemaId - schema id
   */
  schema<T extends any>(schemaId: string, schema: T): this
  schema<T extends any>(schemaId: string, schema?: T): this | T {
    if (typeof schema === 'undefined') {
      return this.getSchema(schemaId)
    }
    return this.addSchema(schemaId, schema)
  }

  /**
   * Gets a keyword by name, an alias of .getKeyword()
   *
   * @param {string} name - keyword name
   */
  keyword<T extends any>(name: string): T
  /**
   * Registers a keyword with name, an alias of .addKeyword()
   *
   * @param {string} schemaId - keyword name
   */
  keyword<T extends any>(name: string, definition: T): this
  keyword<T extends any>(name: string, definition?: T): this | T {
    if (typeof definition === 'undefined') {
      return this.getKeyword(name)
    }
    return this.addKeyword(name, definition)
  }

  /**
   * Registers a format with name, an alias of .addFormat()
   *
   * @param {string} name - format name
   */
  format<T extends any>(name: string, formatter: T): this {
    return this.addFormat(name, formatter)
  }
}
register(AjvSchemaValidator)
register(AjvSchemaValidator, SchemaValidatorClass)
