declare namespace Najs.Contracts {
    interface Response extends Contracts.Autoload {
        /**
         * Perform response for current request.
         *
         * @param {Object} request
         * @param {Object} response
         * @param {Object} driver
         */
        respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>): void;
    }
}
