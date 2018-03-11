"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BodyParserMiddleware_1 = require("./middleware/BodyParserMiddleware");
const ExpressCorsMiddleware_1 = require("./middleware/ExpressCorsMiddleware");
const ExpressCsurfMiddleware_1 = require("./middleware/ExpressCsurfMiddleware");
const SessionMiddleware_1 = require("./middleware/SessionMiddleware");
const CookieMiddleware_1 = require("./middleware/CookieMiddleware");
const RequestDataMiddleware_1 = require("./middleware/RequestDataMiddleware");
const InputHandlebarsHelperMiddleware_1 = require("./middleware/InputHandlebarsHelperMiddleware");
const BodyHandlebarsHelperMiddleware_1 = require("./middleware/BodyHandlebarsHelperMiddleware");
const QueryHandlebarsHelperMiddleware_1 = require("./middleware/QueryHandlebarsHelperMiddleware");
const ParamsHandlebarsHelperMiddleware_1 = require("./middleware/ParamsHandlebarsHelperMiddleware");
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
const AuthMiddleware_1 = require("./middleware/AuthMiddleware");
const lodash_2 = require("lodash");
class HttpKernel {
    constructor() {
        this.middlewareGroup = {
            web: ['body-parser', 'cookie-parser', 'csrf', 'request-data', 'session']
        };
        this.globalMiddleware = {
            default: {
                'body-parser': BodyParserMiddleware_1.BodyParserMiddleware.className,
                'cookie-parser': CookieMiddleware_1.CookieMiddleware.className,
                'request-data': RequestDataMiddleware_1.RequestDataMiddleware.className,
                csrf: ExpressCsurfMiddleware_1.ExpressCsurfMiddleware.className,
                session: SessionMiddleware_1.SessionMiddleware.className
            },
            auth: AuthMiddleware_1.AuthMiddleware.className,
            cors: ExpressCorsMiddleware_1.ExpressCorsMiddleware.className,
            csrf: ExpressCsurfMiddleware_1.ExpressCsurfMiddleware.className,
            session: SessionMiddleware_1.SessionMiddleware.className,
            cookie: CookieMiddleware_1.CookieMiddleware.className,
            'body-parser': BodyParserMiddleware_1.BodyParserMiddleware.className,
            'input-helper': InputHandlebarsHelperMiddleware_1.InputHandlebarsHelperMiddleware.className,
            'body-helper': BodyHandlebarsHelperMiddleware_1.BodyHandlebarsHelperMiddleware.className,
            'query-helper': QueryHandlebarsHelperMiddleware_1.QueryHandlebarsHelperMiddleware.className,
            'params-helper': ParamsHandlebarsHelperMiddleware_1.ParamsHandlebarsHelperMiddleware.className,
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
        const params = name.split(':');
        const className = params[0];
        const middlewareSettings = this.findMiddlewareByName(className);
        if (lodash_2.isPlainObject(middlewareSettings)) {
            return this.createGroupMiddleware(middlewareSettings);
        }
        return this.createMiddleware(middlewareSettings, className, params);
    }
    createGroupMiddleware(settings) {
        const result = [];
        for (const name in settings) {
            const params = name.split(':');
            const className = params[0];
            result.push(this.createMiddleware(settings[name], className, params));
        }
        return lodash_2.flatten(result);
    }
    createMiddleware(settings, className, params) {
        const result = [];
        if (Array.isArray(settings)) {
            const middlewareList = settings;
            middlewareList.forEach((className) => {
                const middleware = najs_binding_1.make(className, params);
                if (middleware) {
                    result.push(middleware);
                }
            });
        }
        if (lodash_1.isString(settings)) {
            const middleware = najs_binding_1.make(settings, params);
            if (middleware) {
                result.push(middleware);
            }
        }
        return result;
    }
}
exports.HttpKernel = HttpKernel;
najs_binding_1.register(HttpKernel);
