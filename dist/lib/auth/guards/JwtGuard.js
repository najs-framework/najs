"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const ConfigFacade_1 = require("../../facades/global/ConfigFacade");
const Guard_1 = require("./Guard");
const base64url_1 = require("base64url");
const Crypto = require("crypto");
const JWT = require("jsonwebtoken");
const Moment = require("moment");
class JwtGuard extends Guard_1.Guard {
    initialize() {
        this.options = ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Auth.jwtGuard, {
            secret: 'najs',
            expireInMinute: 30,
            encrypt: false,
            encryptPassword: '',
            encryptAlgorithm: 'aes256',
            encryptedPrefix: ''
        });
    }
    getToken() {
        if (this.controller.request.headers['x-auth-token']) {
            return this.controller.request.headers['x-auth-token'];
        }
        if (this.controller.request.headers['authorization']) {
            // 'Bearer ' has 7 characters
            return this.controller.request.headers['authorization'].substr(7);
        }
        if (this.controller.cookie.exists('token')) {
            return this.controller.cookie.get('token', '');
        }
        return process.env.NODE_ENV !== 'production' && this.controller.request['query']['token']
            ? this.controller.request['query']['token']
            : '';
    }
    encryptToken(token) {
        if (!this.options.encrypt) {
            return token;
        }
        const cipher = Crypto.createCipher(this.options.encryptAlgorithm, this.options.encryptPassword);
        let encrypted = cipher.update(token, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return this.options.encryptedPrefix + base64url_1.default.fromBase64(encrypted);
    }
    decryptToken(input) {
        if (!this.options.encrypt) {
            return input;
        }
        const encrypted = base64url_1.default.toBase64(input.substr(this.options.encryptedPrefix.length));
        const decipher = Crypto.createDecipher(this.options.encryptAlgorithm, this.options.encryptPassword);
        let token = decipher.update(encrypted, 'base64', 'utf8');
        token += decipher.final('utf8');
        return token;
    }
    hasUser(user) {
        return !!this.getToken();
    }
    async retrieveUser() {
        const rawToken = this.getToken();
        if (!rawToken) {
            return undefined;
        }
        try {
            const token = this.decryptToken(rawToken);
            const payload = JWT.verify(this.decryptToken(token), this.options.secret);
            return payload.data;
        }
        catch (exception) {
            if (exception instanceof JWT.TokenExpiredError) {
            }
            return undefined;
        }
    }
    async attachUser(user, remember) {
        const now = Moment();
        const expired = remember ? now.add(this.options.expireInMinute, 'minutes').toDate() : now.add(5, 'years').toDate();
        const payload = {
            exp: Math.floor(expired.getTime() / 1000),
            data: user
        };
        const token = this.encryptToken(JWT.sign(payload, this.options.secret));
        this.controller.response.setHeader('X-Auth-Token', token);
        this.controller.cookie.forever('token', token);
    }
    async detachUser(user) {
        // TODO: forget token
        this.controller.cookie.forget('token');
    }
}
exports.JwtGuard = JwtGuard;
