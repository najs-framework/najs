"use strict";
/// <reference path="../contracts/types/http.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const PoweredByMiddleware_1 = require("./middleware/built-ins/PoweredByMiddleware");
const RequestIdMiddleware_1 = require("./middleware/built-ins/RequestIdMiddleware");
const StaticMiddleware_1 = require("./middleware/built-ins/StaticMiddleware");
const CorsMiddleware_1 = require("./middleware/built-ins/CorsMiddleware");
const CsurfMiddleware_1 = require("./middleware/built-ins/CsurfMiddleware");
const SessionMiddleware_1 = require("./middleware/built-ins/SessionMiddleware");
const CookieMiddleware_1 = require("./middleware/built-ins/CookieMiddleware");
const BodyParserMiddleware_1 = require("./middleware/built-ins/BodyParserMiddleware");
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
const AuthMiddleware_1 = require("./middleware/AuthMiddleware");
const lodash_2 = require("lodash");
class HttpKernel {
    constructor() {
        this.globalMiddleware = {
            core: {
                'powered-by:Najs/Express': PoweredByMiddleware_1.PoweredByMiddleware.className,
                'request-id': RequestIdMiddleware_1.RequestIdMiddleware.className
            },
            web: {
                'powered-by:Najs/Express': PoweredByMiddleware_1.PoweredByMiddleware.className,
                'request-id': RequestIdMiddleware_1.RequestIdMiddleware.className,
                static: StaticMiddleware_1.StaticMiddleware.className,
                'body-parser': BodyParserMiddleware_1.BodyParserMiddleware.className,
                'cookie-parser': CookieMiddleware_1.CookieMiddleware.className,
                csrf: CsurfMiddleware_1.CsurfMiddleware.className,
                session: SessionMiddleware_1.SessionMiddleware.className
            },
            auth: AuthMiddleware_1.AuthMiddleware.className,
            cors: CorsMiddleware_1.CorsMiddleware.className,
            csrf: CsurfMiddleware_1.CsurfMiddleware.className,
            csurf: CsurfMiddleware_1.CsurfMiddleware.className,
            session: SessionMiddleware_1.SessionMiddleware.className,
            cookie: CookieMiddleware_1.CookieMiddleware.className,
            static: StaticMiddleware_1.StaticMiddleware.className,
            'body-parser': BodyParserMiddleware_1.BodyParserMiddleware.className,
            'request-id': RequestIdMiddleware_1.RequestIdMiddleware.className
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
