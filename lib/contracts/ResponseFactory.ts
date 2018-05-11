/// <reference path="Response.ts" />
/// <reference path="ViewResponse.ts" />

namespace Najs.Contracts {
  export interface ResponseFactory {
    /**
     * Render and response a given view with variables.
     *
     * @param {string} view
     * @param {Object} variable
     */
    view<T extends Object = {}>(view: string, variables?: T): ViewResponse

    /**
     * Response given value in json format.
     *
     * @param {mixed} value
     */
    json(value: any): Response

    /**
     * Response give value in jsonp format.
     *
     * @param {mixed} value
     */
    jsonp(value: any): Response

    /**
     * Redirect to url with given status.
     *
     * @param {string} url
     * @param {number} status
     */
    redirect(url: string, status?: number): Response

    /**
     * Redirect to previous url, if not found use defaultUrl.
     *
     * @param {string} defaultUrl
     */
    back(defaultUrl?: string): Response
  }
}
