"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const najs_eloquent_1 = require("najs-eloquent");
const mongoose_1 = require("mongoose");
const Crypto = require("crypto");
exports.GenericUserBase = najs_eloquent_1.Eloquent.Mongoose();
class GenericUser extends exports.GenericUserBase {
    getClassName() {
        return GenericUser.className;
    }
    getSchema() {
        return new mongoose_1.Schema({
            email: { type: String, required: true },
            password: { type: String, required: true },
            password_salt: { type: String, required: true },
            remember_token: { type: String }
        }, { collection: 'users' });
    }
    isValidCredentials(credentials) {
        return credentials['email'] && credentials['password'];
    }
    createQueryByCredentials(credentials) {
        return this.where('email', credentials['email']);
    }
    hashPassword(password, passwordSalt) {
        const hash = Crypto.createHmac('sha512', this.password_salt);
        hash.update(password);
        return hash.digest('base64');
    }
    getAuthIdentifierName() {
        return 'id';
    }
    getAuthIdentifier() {
        return this.id;
    }
    getAuthPassword() {
        return this.password;
    }
    getRememberToken() {
        return this.remember_token;
    }
    setRememberToken(value) {
        this.remember_token = value;
    }
    getRememberTokenName() {
        return 'remember_token';
    }
    async retrieveById(identifier) {
        return this.where('id', identifier).first();
    }
    async retrieveByToken(identifier, token) {
        return this.where(this.getAuthIdentifierName(), identifier)
            .where(this.getRememberTokenName(), token)
            .first();
    }
    async updateRememberToken(user, token) {
        this.where(user.getAuthIdentifierName(), user.getAuthIdentifier()).update({
            [user.getRememberTokenName()]: token
        });
    }
    async retrieveByCredentials(credentials) {
        if (this.isValidCredentials(credentials)) {
            return this.createQueryByCredentials(credentials).first();
        }
        return undefined;
    }
    async validateCredentials(user, credentials) {
        const hashedPassword = this.hashPassword(credentials['password'], user['password_salt']);
        return hashedPassword === user.getAuthPassword();
    }
}
GenericUser.className = constants_1.AuthClass.GenericUser;
exports.GenericUser = GenericUser;
najs_binding_1.register(GenericUser);
