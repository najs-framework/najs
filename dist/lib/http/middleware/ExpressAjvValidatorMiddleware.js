"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
class ExpressAjvValidatorMiddleware {
    getClassName() {
        return ExpressAjvValidatorMiddleware.className;
    }
    async before(request, response) { }
    async after(request, response, result) { }
}
ExpressAjvValidatorMiddleware.className = 'ExpressAjvValidatorMiddleware';
exports.ExpressAjvValidatorMiddleware = ExpressAjvValidatorMiddleware;
najs_binding_1.register(ExpressAjvValidatorMiddleware);
