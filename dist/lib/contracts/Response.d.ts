declare namespace Najs.Contracts {
    interface Response<Request = any, Response = any> extends Contracts.Autoload {
        /**
         * Perform response for current request.
         *
         * @param {Object} request
         * @param {Object} response
         * @param {Object} driver
         */
        respond(request: Request, response: Response, driver: Najs.Contracts.HttpDriver<any, Response>): void;
    }
}
