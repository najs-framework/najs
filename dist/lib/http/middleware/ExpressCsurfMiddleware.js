"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../constants");
const ViewResponse_1 = require("../response/types/ViewResponse");
const register_1 = require("../../core/register");
const Csurf = require("csurf");
const NajsFacade_1 = require("../../core/NajsFacade");
class ExpressCsurfMiddleware {
    constructor() {
        if (!exports.CsurfProtection) {
            exports.CsurfProtection = Csurf(this.getOptions());
        }
    }
    getOptions() {
        return NajsFacade_1.NajsFacade.getConfig(constants_1.ConfigurationKeys.Middleware.csurfOptions, { cookie: true });
    }
    getClassName() {
        return ExpressCsurfMiddleware.className;
    }
    before(request, response) {
        return new Promise(function (resolve, reject) {
            exports.CsurfProtection(request, response, function (error) {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    }
    async after(request, response, result) {
        if (result instanceof ViewResponse_1.ViewResponse) {
            const token = request.csrfToken();
            result
                .with('csrfToken', token)
                .with('CsrfToken', token)
                .with('csrf_token', token)
                .with('CSRF_TOKEN', token);
        }
        return result;
    }
}
ExpressCsurfMiddleware.className = 'ExpressCsurfMiddleware';
exports.ExpressCsurfMiddleware = ExpressCsurfMiddleware;
register_1.register(ExpressCsurfMiddleware);
