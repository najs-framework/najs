"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../constants");
const najs_binding_1 = require("najs-binding");
const Guard_1 = require("./Guard");
class SessionGuard extends Guard_1.Guard {
    getClassName() {
        return constants_1.AuthClass.SessionGuard;
    }
    getSessionKey() {
        return 'user';
    }
    hasUser(user) {
        const sessionKey = this.getSessionKey();
        const cookieKey = this.getCookieRememberKey();
        if (typeof user === 'undefined') {
            return this.controller.session.has(sessionKey) || this.controller.cookie.has(cookieKey);
        }
        if (this.controller.session.has(sessionKey)) {
            return this.controller.session.get(sessionKey) === user.getAuthIdentifier();
        }
        return this.getRememberData().id === user.getAuthIdentifier();
    }
    async retrieveUser() {
        if (this.hasUser()) {
            const user = await this.provider.retrieveById(this.controller.session.get(this.getSessionKey()));
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
            await this.rememberUser(user);
        }
    }
    async detachUser(user) {
        this.controller.session.forget(this.getSessionKey());
        this.controller.cookie.forget(this.getCookieRememberKey());
    }
}
SessionGuard.className = constants_1.AuthClass.SessionGuard;
exports.SessionGuard = SessionGuard;
najs_binding_1.register(SessionGuard);
