/// <reference path="types/routing.d.ts" />
declare namespace Najs.Contracts {
    interface RouteFactory extends Autoload, Http.Routing.Verbs, Http.Routing.Control {
        /**
         * Create an url by route's name.
         *
         * @param {string} name
         */
        createByName(name: string): string;
        /**
         * Create an url by route's name with given parameters.
         *
         * @param {string} name
         * @param {Object} param
         */
        createByName(name: string, param: Object): string;
        /**
         * Create an url by route's name with param and options.
         *
         * @param {string} name
         * @param {Object} param
         * @param {Object} options
         */
        createByName(name: string, param: Object, options: {
            encode: (value: string) => string;
        }): string;
        /**
         * Create group of routes.
         *
         * @param {Function} callback
         */
        group(callback: () => void): Najs.Http.Routing.GroupChain;
        /**
         * Create new named route with given name.
         *
         * @param {string} name
         */
        name(name: string): Najs.Http.Routing.NameChain;
    }
}
