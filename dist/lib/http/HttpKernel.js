"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressCorsMiddleware_1 = require("./middleware/ExpressCorsMiddleware");
const ExpressCsurfMiddleware_1 = require("./middleware/ExpressCsurfMiddleware");
const SessionMiddleware_1 = require("./middleware/SessionMiddleware");
const RequestDataMiddleware_1 = require("./middleware/RequestDataMiddleware");
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
class HttpKernel {
    constructor() {
        this.globalMiddleware = {
            cors: ExpressCorsMiddleware_1.ExpressCorsMiddleware.className,
            csrf: ExpressCsurfMiddleware_1.ExpressCsurfMiddleware.className,
            session: SessionMiddleware_1.SessionMiddleware.className,
            input: RequestDataMiddleware_1.RequestDataMiddleware.className,
            'request-data': RequestDataMiddleware_1.RequestDataMiddleware.className
        };
        this.middleware = {};
    }
    findMiddlewareByName(name) {
        if (typeof this.middleware[name] !== 'undefined') {
            return this.middleware[name];
        }
        if (typeof this.globalMiddleware[name] !== 'undefined') {
            return this.globalMiddleware[name];
        }
        return undefined;
    }
    getClassName() {
        return constants_1.SystemClass.HttpKernel;
    }
    getMiddleware(name) {
        const result = [];
        const middlewareSettings = this.findMiddlewareByName(name);
        if (Array.isArray(middlewareSettings)) {
            const middlewareList = middlewareSettings;
            middlewareList.forEach((className) => {
                const middleware = najs_binding_1.make(className);
                if (middleware) {
                    result.push(middleware);
                }
            });
        }
        if (lodash_1.isString(middlewareSettings)) {
            const middleware = najs_binding_1.make(middlewareSettings);
            if (middleware) {
                result.push(middleware);
            }
        }
        return result;
    }
}
exports.HttpKernel = HttpKernel;
najs_binding_1.register(HttpKernel);
