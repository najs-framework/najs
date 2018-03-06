"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Guard_1 = require("./Guard");
class PassportGuard extends Guard_1.Guard {
    getSessionKey() {
        return 'passport.user';
    }
    hasUser(user) {
        const sessionKey = this.getSessionKey();
        const cookieKey = this.getCookieRememberKey();
        if (typeof user === 'undefined') {
            return this.controller.session.has(sessionKey) || this.controller.cookie.has(cookieKey);
        }
        if (this.controller.session.has(sessionKey)) {
            return this.controller.request['user'][user.getAuthIdentifierName()] === user.getAuthIdentifier();
        }
        return this.getRememberData().id === user.getAuthIdentifier();
    }
    /**
     * Get the currently authenticated user.
     */
    async retrieveUser() {
        const user = this.controller.request['user'];
        if (!user) {
            const rememberData = this.getRememberData();
            const rememberUser = this.provider.retrieveByToken(rememberData.id, rememberData.token);
            if (rememberUser) {
                this.controller.request['login'](rememberUser);
            }
            return rememberUser;
        }
        return user;
    }
    /**
     * Save the user to request.
     *
     * @param {IAuthenticatable} user
     * @param {boolean} remember
     */
    async attachUser(user, remember) {
        this.controller.request['login'](user);
        if (remember) {
            await this.rememberUser(this.getCookieRememberKey(), user);
        }
    }
    /**
     * Remove the user and out of request.
     *
     * @param {IAuthenticatable} user
     */
    async detachUser(user) {
        this.controller.request['logout']();
        this.controller.cookie.forget(this.getCookieRememberKey());
    }
}
exports.PassportGuard = PassportGuard;
