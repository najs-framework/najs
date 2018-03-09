"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const GenericUser_1 = require("./GenericUser");
const constants_1 = require("../constants");
class EloquentUserProvider {
    constructor() {
        this.model = najs_binding_1.make(this.getModelName());
    }
    getClassName() {
        return constants_1.AuthClass.EloquentUserProvider;
    }
    getModelName() {
        return GenericUser_1.GenericUser.className;
    }
    getLoginName() {
        return 'email';
    }
    getPasswordName() {
        return 'password';
    }
    isValidCredentials(credentials) {
        return !!credentials[this.getLoginName()] && !!credentials[this.getPasswordName()];
    }
    async retrieveById(identifier) {
        return this.model.where(this.model.getAuthIdentifierName(), identifier).first();
    }
    async retrieveByToken(identifier, token) {
        return this.model
            .where(this.model.getAuthIdentifierName(), identifier)
            .where(this.model.getRememberTokenName(), token)
            .first();
    }
    async updateRememberToken(user, token) {
        this.model.where(user.getAuthIdentifierName(), user.getAuthIdentifier()).update({
            [user.getRememberTokenName()]: token
        });
    }
    async retrieveByCredentials(credentials) {
        if (this.isValidCredentials(credentials)) {
            return this.model.where(this.getLoginName(), credentials[this.getLoginName()]).first();
        }
        return undefined;
    }
    async validateCredentials(user, credentials) {
        return user.getAuthPassword(credentials[this.getPasswordName()]) === user.getAuthPassword();
    }
}
EloquentUserProvider.className = constants_1.AuthClass.EloquentUserProvider;
exports.EloquentUserProvider = EloquentUserProvider;
najs_binding_1.register(EloquentUserProvider);
