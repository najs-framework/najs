export interface ISchemaValidator {
  getSchema<T extends any>(schemaId: string): T
  addSchema<T extends any>(schemaId: string, schema: T): this
  removeSchema(schemaId: string): this

  getKeyword<T extends any>(keyword: string): T
  addKeyword<T extends any>(keyword: string, definition: T): this
  removeKeyword(keyword: string): this

  addFormat<T extends any>(name: string, formatter: T): this

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

  /**
   * Registers a format with name, an alias of .addFormat()
   *
   * @param {string} name - format name
   */
  format<T extends any>(name: string, formatter: T): this
}
