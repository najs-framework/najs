"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HandlebarsViewResponse_1 = require("../../view/handlebars/HandlebarsViewResponse");
const HandlebarsHelper_1 = require("../../view/handlebars/HandlebarsHelper");
const CookieHandlebarsHelper_1 = require("../../view/handlebars/helpers/CookieHandlebarsHelper");
const ConfigFacade_1 = require("../../facades/global/ConfigFacade");
const constants_1 = require("../../constants");
const CookieParserNative = require("cookie-parser");
class CookieMiddleware {
    constructor() {
        if (!exports.CookieParser) {
            exports.CookieParser = CookieParserNative(this.getSecret(), this.getOptions());
        }
    }
    getSecret() {
        return ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Cookie.secret, 'najs');
    }
    getOptions() {
        return ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Cookie.options, {});
    }
    before(request, response) {
        return new Promise(function (resolve, reject) {
            exports.CookieParser(request, response, function (error) {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    }
    async after(request, response, result, controller) {
        if (result instanceof HandlebarsViewResponse_1.HandlebarsViewResponse) {
            result.helper('Cookie', HandlebarsHelper_1.HandlebarsHelper.create(CookieHandlebarsHelper_1.CookieHandlebarsHelper, controller));
        }
        return result;
    }
}
CookieMiddleware.className = 'Najs.CookieMiddleware';
exports.CookieMiddleware = CookieMiddleware;
najs_binding_1.register(CookieMiddleware);
