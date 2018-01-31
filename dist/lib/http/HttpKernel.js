"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = require("../core/make");
const lodash_1 = require("lodash");
const register_1 = require("../core/register");
class HttpKernel {
    constructor() {
        this.middleware = {};
    }
    getClassName() {
        return HttpKernel.className;
    }
    getMiddleware(name) {
        const result = [];
        if (Array.isArray(this.middleware[name])) {
            const middlewareList = this.middleware[name];
            middlewareList.forEach((className) => {
                const middleware = make_1.make(className);
                if (middleware) {
                    result.push(middleware);
                }
            });
        }
        if (lodash_1.isString(this.middleware[name])) {
            const middleware = make_1.make(this.middleware[name]);
            if (middleware) {
                result.push(middleware);
            }
        }
        return result;
    }
}
HttpKernel.className = 'HttpKernel';
exports.HttpKernel = HttpKernel;
register_1.register(HttpKernel);
