/// <reference path="types/http.ts" />

namespace Najs.Contracts {
  export interface HttpDriver<T, Response> extends Autoload {
    /**
     * Get the native driver instance
     */
    getNativeDriver(): T

    /**
     * Start the http server.
     * @param {Object} options
     */
    start(options?: Http.StartOptions): void

    /**
     * Perform single route with given data.
     *
     * @param {IRouteData} data
     */
    route(data: Http.IRouteData): void

    /**
     * Render and response given view to client.
     *
     * @param {ServerResponse} response
     * @param {string} view
     * @param {Object} variables
     */
    respondView(response: Response, view: string, variables: Object): void

    /**
     * Response in JSON format.
     *
     * @param {ServerResponse} response
     * @param {mixed} value
     */
    respondJson(response: Response, value: any): void

    /**
     * Response in JSONP format.
     *
     * @param {ServerResponse} response
     * @param {mixed} value
     */
    respondJsonp(response: Response, value: any): void

    /**
     * Redirect client to an given path with given code.
     *
     * @param {ServerResponse} response
     * @param {string} path
     * @param {number} code
     */
    respondRedirect(response: Response, path: string, code: number): void
  }
}
