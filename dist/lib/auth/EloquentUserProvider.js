"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../constants");
const najs_binding_1 = require("najs-binding");
class EloquentUserProvider {
    getClassName() {
        return constants_1.AuthClass.EloquentUserProvider;
    }
    getAuthLoginName() {
        return 'email';
    }
    getAuthPasswordName() {
        return 'password';
    }
    isValidCredentials(credentials) {
        return credentials[this.getAuthLoginName()] && credentials[this.getAuthPasswordName()];
    }
    async retrieveById(identifier) {
        return this.model.where(this.model.getAuthIdentifier(), identifier).first();
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
            return this.model.where(this.getAuthLoginName(), credentials[this.getAuthLoginName()]).first();
        }
        return undefined;
    }
    async validateCredentials(user, credentials) {
        return user.getAuthPassword(credentials[this.getAuthPasswordName()]) === user.getAuthPassword();
    }
}
EloquentUserProvider.className = constants_1.AuthClass.EloquentUserProvider;
exports.EloquentUserProvider = EloquentUserProvider;
najs_binding_1.register(EloquentUserProvider);
