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
    set password(password) {
        this.attributes['password'] = this.hashPassword(password);
    }
    get password_salt() {
        if (!this.attributes['password_salt']) {
            this.attributes['password_salt'] = Crypto.randomBytes(24).toString('base64');
        }
        return this.attributes['password_salt'];
    }
    hashPassword(password) {
        const hash = Crypto.createHmac('sha512', this.password_salt);
        hash.update(password);
        return hash.digest('base64');
    }
    // -------------------------------------------------------------------------------------------------------------------
    getAuthIdentifierName() {
        return 'id';
    }
    getAuthIdentifier() {
        return this.id;
    }
    getAuthPassword(password) {
        if (password) {
            return this.hashPassword(password);
        }
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
}
GenericUser.className = constants_1.AuthClass.GenericUser;
exports.GenericUser = GenericUser;
najs_binding_1.register(GenericUser);
