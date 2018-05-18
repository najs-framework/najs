"use strict";
/// <reference path="../../contracts/Cookie.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const RequestDataReader_1 = require("../request/RequestDataReader");
const ExpressController_1 = require("../controller/ExpressController");
const lodash_1 = require("lodash");
class Cookie extends najs_facade_1.ContextualFacade {
    constructor(controller) {
        super(controller);
        controller.cookie = this;
        if (controller instanceof ExpressController_1.ExpressController) {
            const request = controller.request;
            this.data = Object.assign({}, request.cookies, request.signedCookies);
            this.cookies = request.cookies;
            this.signedCookies = request.signedCookies;
        }
    }
    getClassName() {
        return constants_1.Najs.Http.Cookie;
    }
    getResponse() {
        return this.context.response;
    }
    isSigned(...args) {
        const paths = lodash_1.flatten(args);
        for (const path of paths) {
            if (!this.signedCookies[path]) {
                return false;
            }
        }
        return true;
    }
    has(path, signed) {
        if (signed === true) {
            return lodash_1.has(this.signedCookies, path) && !!lodash_1.get(this.signedCookies, path);
        }
        if (signed === false) {
            return lodash_1.has(this.cookies, path) && !!lodash_1.get(this.cookies, path);
        }
        return RequestDataReader_1.RequestDataReader.prototype.has.apply(this, arguments);
    }
    exists(path, signed) {
        if (signed === true) {
            return lodash_1.has(this.signedCookies, path);
        }
        if (signed === false) {
            return lodash_1.has(this.cookies, path);
        }
        return RequestDataReader_1.RequestDataReader.prototype.exists.apply(this, arguments);
    }
    all(signed) {
        if (signed === true) {
            return this.signedCookies;
        }
        if (signed === false) {
            return this.cookies;
        }
        return this.data;
    }
    forget(name, arg1, arg2) {
        if (typeof arg1 === 'undefined') {
            this.getResponse().clearCookie(name);
            return this;
        }
        const opts = typeof arg1 === 'object' ? arg1 : {};
        if (typeof arg1 === 'string') {
            opts.path = arg1;
        }
        if (typeof arg2 === 'string') {
            opts.domain = arg2;
        }
        this.getResponse().clearCookie(name, opts);
        return this;
    }
    make(name, value, optionsOrSigned = false, minutes = 0, path = undefined, domain = undefined, secure = undefined, httpOnly = undefined) {
        if (typeof optionsOrSigned === 'object') {
            this.getResponse().cookie(name, value, optionsOrSigned);
            return this;
        }
        const opts = { signed: optionsOrSigned };
        if (minutes > 0) {
            opts.maxAge = minutes * 60 * 1000;
        }
        if (typeof path !== 'undefined') {
            opts.path = path;
        }
        if (typeof domain !== 'undefined') {
            opts.domain = domain;
        }
        if (typeof secure !== 'undefined') {
            opts.secure = secure;
        }
        if (typeof httpOnly !== 'undefined') {
            opts.httpOnly = httpOnly;
        }
        this.getResponse().cookie(name, value, opts);
        return this;
    }
    forever(name, value, optionsOrSigned = false, path = undefined, domain = undefined, secure = undefined, httpOnly = undefined) {
        if (typeof optionsOrSigned === 'object') {
            // 5 years: 1000 x 60 x 60 x 24 x 365 x 5
            optionsOrSigned.maxAge = 157680000000;
            return this.make(name, value, optionsOrSigned);
        }
        return this.make(name, value, optionsOrSigned, 157680000000, path, domain, secure, httpOnly);
    }
}
exports.Cookie = Cookie;
// implements IRequestDataReader implicitly
const IRequestDataReaderFunctions = ['get', 'only', 'except'];
for (const name of IRequestDataReaderFunctions) {
    Cookie.prototype[name] = function () {
        return RequestDataReader_1.RequestDataReader.prototype[name].apply(this, arguments);
    };
}
najs_binding_1.register(Cookie, constants_1.Najs.Http.Cookie);
