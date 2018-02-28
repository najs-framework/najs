"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HandlebarsViewResponse_1 = require("../../view/handlebars/HandlebarsViewResponse");
const HandlebarsHelper_1 = require("../../view/handlebars/HandlebarsHelper");
const SessionHandlebarsHelper_1 = require("../../view/handlebars/helpers/SessionHandlebarsHelper");
class SessionMiddleware {
    async after(request, response, result, controller) {
        if (result instanceof HandlebarsViewResponse_1.HandlebarsViewResponse) {
            result.helper('Session', HandlebarsHelper_1.HandlebarsHelper.create(SessionHandlebarsHelper_1.SessionHandlebarsHelper, controller));
        }
        return result;
    }
}
SessionMiddleware.className = 'Najs.SessionMiddleware';
exports.SessionMiddleware = SessionMiddleware;
najs_binding_1.register(SessionMiddleware);
