declare namespace Najs.Contracts {
    interface Config extends Autoload {
        /**
         * Get the configuration with given name.
         *
         * @param {string} name
         */
        get<T>(name: string): T | undefined;
        /**
         * Get the configuration with given name.
         *
         * @param {string} name
         * @param {mixed} defaultValue
         */
        get<T>(name: string, defaultValue?: T): T;
        /**
         * Determine that the configuration under given name exists or not.
         * @param name
         */
        has(name: string): boolean;
    }
}
