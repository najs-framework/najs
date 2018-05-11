/// <reference path="Response.d.ts" />
declare namespace Najs.Contracts {
    interface ViewResponse extends Response {
        /**
         * Add new variable with given name and value.
         *
         * @param {string} name
         * @param {mixed} value
         */
        with(name: string, value: any): ViewResponse;
    }
}
