"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("../../core/register");
class ExpressAjvValidatorMiddleware {
    getClassName() {
        return ExpressAjvValidatorMiddleware.className;
    }
    async before(request, response) { }
    async after(request, response, result) { }
}
ExpressAjvValidatorMiddleware.className = 'ExpressAjvValidatorMiddleware';
exports.ExpressAjvValidatorMiddleware = ExpressAjvValidatorMiddleware;
register_1.register(ExpressAjvValidatorMiddleware);
