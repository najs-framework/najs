export declare type Decorator = (target: any) => any;
/**
 * Decorator to register a class.
 *
 * @returns {decorator}
 */
export declare function register(): Decorator;
/**
 * Decorator to register a class with custom class name
 *
 * @param {string} className - the custom class name.
 * @returns {decorator}
 */
export declare function register(className: string): Decorator;
/**
 * Register class to ClassRegistry, we can use `make` to create an instance of this class later
 *
 * @param {class|function} classDefinition - class definition
 */
export declare function register<T>(classDefinition: T): void;
/**
 * Register class to ClassRegistry with custom name
 *
 * @param {class|function} classDefinition - class definition
 * @param {string} className - custom class name
 */
export declare function register<T>(classDefinition: T, className: string): void;
/**
 * Register class to ClassRegistry with custom name and overridable setting
 *
 * @param {class|function} classDefinition - class definition
 * @param {string} className - custom class name
 * @param {boolean} overridable - if true this class could not be registered again
 */
export declare function register<T>(classDefinition: T, className: string, overridable: boolean): void;
/**
 * Register class to ClassRegistry with custom name, overridable and singleton setting
 *
 * @param {class|function} classDefinition - class definition
 * @param {string} className - custom class name
 * @param {boolean} overridable - if true this class could not be registered again
 * @param {boolean} singleton - if true `make` creates only one instance and reuse for every calls
 */
export declare function register<T>(classDefinition: T, className: string, overridable: boolean, singleton: boolean): void;
