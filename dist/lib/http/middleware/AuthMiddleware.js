"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthContextualFacade_1 = require("../../facades/contextual/AuthContextualFacade");
class AuthMiddleware {
    constructor(guard) {
        this.guard = guard;
    }
    async before(request, response, controller) {
        const auth = AuthContextualFacade_1.AuthContextualFacade.from(controller);
        if (this.guard) {
            auth.guard(this.guard);
        }
    }
}
AuthMiddleware.className = 'Najs.AuthMiddleware';
exports.AuthMiddleware = AuthMiddleware;
