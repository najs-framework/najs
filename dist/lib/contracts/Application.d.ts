/// <reference path="types/najs.d.ts" />
declare namespace Najs.Contracts {
    interface Application extends Autoload {
        /**
         * Make an instance of the class by class name or class definition.
         *
         * @param {string|Function} classDefinition
         */
        make<T>(classDefinition: string | ClassDefinition<T>): T;
        /**
         * Make an instance of the class with params by class name and definitions
         *
         * @param {string|Function} classDefinition
         * @param {Array} constructorParams
         */
        makeWith<T>(classDefinition: string | ClassDefinition<T>, constructorParams: any[]): T;
        /**
         * Make an instance of the class and copy all property from given data to the instance.
         *
         * @param {string|Function} classDefinition
         * @param {Object} data
         */
        makeWith<T>(classDefinition: string | ClassDefinition<T>, data: Object): T;
        /**
         * Register an class to system.
         *
         * @param {string|Function} classDefinition
         * @param {string} className
         * @param {boolean} overridable
         * @param {boolean} singleton
         */
        register(classDefinition: string | ClassDefinition<any>, className?: string, overridable?: boolean, singleton?: boolean): Application;
        /**
         * Bind the given class name with custom instance created via callback.
         *
         * @param {string} className
         * @param {Function} instanceCreator
         */
        bind(className: string, instanceCreator: () => any): Application;
        /**
         * Bind the given class to an concrete class name.
         *
         * @param {string} className
         * @param {string} concrete
         */
        bind(className: string, concrete: string): Application;
        /**
         * Extend the class by a decorator.
         *
         * @param {string|Function} classDefinition
         * @param {Function} decorator
         */
        extend(classDefinition: string | ClassDefinition<any>, decorator: (instance: any) => any): Application;
    }
}
