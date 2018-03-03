"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Guard_1 = require("./Guard");
class PassportGuard extends Guard_1.Guard {
    hasUser(user) {
        if (typeof user === 'undefined') {
            return this.controller.session.has('passport.user');
        }
        return this.controller.request['user'][user.getAuthIdentifierName()] === user.getAuthIdentifier();
    }
    /**
     * Get the currently authenticated user.
     */
    async retrieveUser() {
        return this.controller.request['user'];
    }
    /**
     * Save the user to request.
     *
     * @param {IAuthenticatable} user
     * @param {boolean} remember
     */
    async attachUser(user, remember) {
        this.controller.request['login'](user);
    }
    /**
     * Remove the user and out of request.
     *
     * @param {IAuthenticatable} user
     */
    async detachUser(user) {
        this.controller.request['logout']();
    }
}
exports.PassportGuard = PassportGuard;
