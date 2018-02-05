"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NajsFacade_1 = require("../../core/NajsFacade");
const constants_1 = require("../../constants");
const register_1 = require("../../core/register");
const CORS = require("cors");
class ExpressCorsMiddleware {
    constructor() {
        if (!exports.CorsEnable) {
            exports.CorsEnable = CORS(this.getOptions());
        }
    }
    getOptions() {
        return NajsFacade_1.NajsFacade.getConfig(constants_1.ConfigurationKeys.Middleware.corsOptions, {});
    }
    getClassName() {
        return ExpressCorsMiddleware.className;
    }
    before(request, response) {
        return new Promise(function (resolve, reject) {
            exports.CorsEnable(request, response, function (error) {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    }
}
ExpressCorsMiddleware.className = 'ExpressCorsMiddleware';
exports.ExpressCorsMiddleware = ExpressCorsMiddleware;
register_1.register(ExpressCorsMiddleware);
