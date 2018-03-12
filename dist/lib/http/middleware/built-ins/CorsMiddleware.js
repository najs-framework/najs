"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigFacade_1 = require("../../../facades/global/ConfigFacade");
const constants_1 = require("../../../constants");
const najs_binding_1 = require("najs-binding");
const ExpressMiddlewareBase_1 = require("../ExpressMiddlewareBase");
const CORS = require("cors");
class CorsMiddleware extends ExpressMiddlewareBase_1.ExpressMiddlewareBase {
    getOptions() {
        return ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Middleware.corsOptions, {});
    }
    getClassName() {
        return CorsMiddleware.className;
    }
    createMiddleware() {
        if (!exports.CorsEnable) {
            exports.CorsEnable = CORS(this.getOptions());
        }
        return exports.CorsEnable;
    }
}
CorsMiddleware.className = 'Najs.CorsMiddleware';
exports.CorsMiddleware = CorsMiddleware;
najs_binding_1.register(CorsMiddleware);
