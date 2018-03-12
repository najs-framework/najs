"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigFacade_1 = require("../../../facades/global/ConfigFacade");
const constants_1 = require("../../../constants");
const ExpressMiddlewareBase_1 = require("../ExpressMiddlewareBase");
const najs_binding_1 = require("najs-binding");
const ViewResponse_1 = require("../../response/types/ViewResponse");
const Csurf = require("csurf");
class CsurfMiddleware extends ExpressMiddlewareBase_1.ExpressMiddlewareBase {
    getOptions() {
        return ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Middleware.csurfOptions, { cookie: true });
    }
    getClassName() {
        return CsurfMiddleware.className;
    }
    createMiddleware() {
        if (!exports.CsurfProtection) {
            exports.CsurfProtection = Csurf(this.getOptions());
        }
        return exports.CsurfProtection;
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
CsurfMiddleware.className = 'Najs.CsurfMiddleware';
exports.CsurfMiddleware = CsurfMiddleware;
najs_binding_1.register(CsurfMiddleware);
