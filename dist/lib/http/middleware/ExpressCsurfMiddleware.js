"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ViewResponse_1 = require("../response/types/ViewResponse");
const register_1 = require("../../core/register");
const Csurf = require("csurf");
class ExpressCsurfMiddleware {
    constructor() {
        if (!exports.CsurfProtection) {
            exports.CsurfProtection = Csurf(this.getOptions());
        }
    }
    getOptions() {
        return { cookie: true };
    }
    getClassName() {
        return ExpressCsurfMiddleware.className;
    }
    before(request, response) {
        return new Promise(function (resolve) {
            exports.CsurfProtection(request, response, resolve);
        });
    }
    async after(request, response, result) {
        if (result instanceof ViewResponse_1.ViewResponse) {
            result.with('csrfToken', request.csrfToken());
        }
        return result;
    }
}
ExpressCsurfMiddleware.className = 'ExpressCsurfMiddleware';
exports.ExpressCsurfMiddleware = ExpressCsurfMiddleware;
register_1.register(ExpressCsurfMiddleware);
