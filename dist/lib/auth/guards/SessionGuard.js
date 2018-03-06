"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Guard_1 = require("./Guard");
const Crypto = require("crypto");
class SessionGuard extends Guard_1.Guard {
    getRememberData() {
        return this.controller.cookie.get(this.getCookieKey(), { id: undefined, token: '' });
    }
    getSessionKey() {
        return 'user';
    }
    getCookieKey() {
        return 'user';
    }
    hasUser(user) {
        const sessionKey = this.getSessionKey();
        const cookieKey = this.getCookieKey();
        if (typeof user === 'undefined') {
            return this.controller.session.has(sessionKey) || this.controller.cookie.has(cookieKey);
        }
        if (this.controller.session.has(sessionKey)) {
            return this.controller.request[sessionKey] === user.getAuthIdentifier();
        }
        return this.getRememberData().id === user.getAuthIdentifier();
    }
    async retrieveUser() {
        if (this.hasUser()) {
            const user = await this.provider.retrieveById(this.controller.request[this.getSessionKey()]);
            if (!user) {
                const rememberData = this.getRememberData();
                return this.provider.retrieveByToken(rememberData.id, rememberData.token);
            }
            return user;
        }
        return undefined;
    }
    async attachUser(user, remember) {
        this.controller.session.put(this.getSessionKey(), user.getAuthIdentifier());
        if (remember) {
            const token = Crypto.randomBytes(48).toString('base64');
            this.provider.updateRememberToken(user, token);
            this.controller.cookie.forever(this.getCookieKey(), { id: user.getAuthIdentifier(), token: token });
        }
    }
    async detachUser(user) {
        this.controller.session.forget(this.getSessionKey());
        this.controller.cookie.forget(this.getCookieKey());
    }
}
exports.SessionGuard = SessionGuard;
