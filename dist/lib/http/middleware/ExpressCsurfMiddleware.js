"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigFacade_1 = require("../../facades/global/ConfigFacade");
const constants_1 = require("./../../constants");
const register_1 = require("../../core/register");
const ViewResponse_1 = require("../response/types/ViewResponse");
const Csurf = require("csurf");
class ExpressCsurfMiddleware {
    constructor() {
        if (!exports.CsurfProtection) {
            exports.CsurfProtection = Csurf(this.getOptions());
        }
    }
    getOptions() {
        return ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Middleware.csurfOptions, { cookie: true });
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
