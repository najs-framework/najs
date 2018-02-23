"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
class HttpKernel {
    constructor() {
        this.middleware = {};
    }
    getClassName() {
        return constants_1.SystemClass.HttpKernel;
    }
    getMiddleware(name) {
        const result = [];
        if (Array.isArray(this.middleware[name])) {
            const middlewareList = this.middleware[name];
            middlewareList.forEach((className) => {
                const middleware = najs_binding_1.make(className);
                if (middleware) {
                    result.push(middleware);
                }
            });
        }
        if (lodash_1.isString(this.middleware[name])) {
            const middleware = najs_binding_1.make(this.middleware[name]);
            if (middleware) {
                result.push(middleware);
            }
        }
        return result;
    }
}
exports.HttpKernel = HttpKernel;
najs_binding_1.register(HttpKernel);
