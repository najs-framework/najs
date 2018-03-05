"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HandlebarsViewResponse_1 = require("../../view/handlebars/HandlebarsViewResponse");
const HandlebarsHelper_1 = require("../../view/handlebars/HandlebarsHelper");
const CookieHandlebarsHelper_1 = require("../../view/handlebars/helpers/CookieHandlebarsHelper");
class CookieMiddleware {
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
