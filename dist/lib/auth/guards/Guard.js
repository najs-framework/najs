"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Crypto = require("crypto");
class Guard {
    // The constructor must be in string literal otherwise typescript don't understand the constructor
    // prettier-ignore
    "constructor"(controller, provider) {
        this.controller = controller;
        this.provider = provider;
        this.initialize();
    }
    /**
     * Get user provider.
     */
    getUserProvider() {
        return this.provider;
    }
    initialize() { }
    getCookieRememberKey() {
        return 'user';
    }
    getRememberData() {
        return this.controller.cookie.get(this.getCookieRememberKey(), { id: undefined, token: '' });
    }
    async rememberUser(cookieKey, user) {
        const token = Crypto.randomBytes(48).toString('base64');
        await this.provider.updateRememberToken(user, token);
        this.controller.cookie.forever(cookieKey, { id: user.getAuthIdentifier(), token: token });
    }
}
exports.Guard = Guard;
