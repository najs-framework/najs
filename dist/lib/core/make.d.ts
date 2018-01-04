/**
 * `make` a class instance
 *
 * @param {class|function} classDefinition - class definition
 */
export declare function make<T>(classDefinition: any): T;
/**
 * `make` a class instance from registered class's name
 *
 * @param {string} className - the registered class name
 */
export declare function make<T>(className: string): T;
/**
 * `make` a class instance with data
 *
 * @param {class|function} classDefinition - class definition
 * @param {Object} data - filled data to instance
 */
export declare function make<T>(classDefinition: any, data: Object): T;
/**
 * `make` a class instance from registered class's name with data
 *
 * @param {class|function} classDefinition - class definition
 * @param {Object} data - filled data to instance
 */
export declare function make<T>(className: string, data: Object): T;
