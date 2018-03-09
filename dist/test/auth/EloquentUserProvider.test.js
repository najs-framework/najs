"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../lib/constants");
const EloquentUserProvider_1 = require("../../lib/auth/EloquentUserProvider");
const GenericUser_1 = require("../../lib/auth/GenericUser");
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
class MongooseProvider {
    getClassName() {
        return MongooseProvider.className;
    }
    getMongooseInstance() {
        return mongoose;
    }
    createModelFromSchema(modelName, schema) {
        return mongoose_1.model(modelName, schema);
    }
}
MongooseProvider.className = 'MongooseProvider';
najs_binding_1.register(MongooseProvider);
describe('EloquentUserProvider', function () {
    it('implements IAutoload', function () {
        const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
        expect(userProvider.getClassName()).toEqual(constants_1.AuthClass.EloquentUserProvider);
    });
    describe('constructor()', function () {
        it('makes model by using make() and the class name provided by .getModelName()', function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            expect(userProvider.model).toBeInstanceOf(GenericUser_1.GenericUser);
        });
    });
    describe('.getModelName()', function () {
        it('returns GenericUser.className by default', function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            expect(userProvider.getModelName()).toEqual(GenericUser_1.GenericUser.className);
        });
    });
    describe('.getLoginName()', function () {
        it('returns "email" literal string', function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            expect(userProvider.getLoginName()).toEqual('email');
        });
    });
    describe('.getPasswordName()', function () {
        it('returns "password" literal string', function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            expect(userProvider.getPasswordName()).toEqual('password');
        });
    });
    describe('protected .isValidCredentials()', function () {
        it('returns true if there is .getLoginName() and .getPasswordName() in credentials', function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            expect(userProvider['isValidCredentials']({})).toBe(false);
            expect(userProvider['isValidCredentials']({ email: '' })).toBe(false);
            expect(userProvider['isValidCredentials']({ password: '' })).toBe(false);
            expect(userProvider['isValidCredentials']({ email: '', password: '' })).toBe(false);
            expect(userProvider['isValidCredentials']({ email: 'test', password: 'test' })).toBe(true);
        });
    });
    describe('.retrieveById()', function () {
        it('simply calls .where() with model.getAuthIdentifierName() then calls .first()', function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            // TODO: update the test when Eloquent implemented Facade
            const getAuthIdentifierNameSpy = Sinon.spy(userProvider.model, 'getAuthIdentifierName');
            const whereSpy = Sinon.spy(userProvider.model, 'where');
            userProvider.retrieveById('000000000000000000000000');
            expect(whereSpy.calledWith('id', '000000000000000000000000')).toBe(true);
            expect(getAuthIdentifierNameSpy.called).toBe(true);
        });
    });
    describe('.retrieveByToken()', function () {
        it('simply calls .where() with model.getAuthIdentifierName() then calls .first()', function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            // TODO: update the test when Eloquent implemented Facade
            userProvider.retrieveByToken('000000000000000000000000', 'test');
        });
    });
    describe('.updateRememberToken()', function () {
        it('simply calls .where() with model.getAuthIdentifierName() then calls .update()', function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            // TODO: update the test when Eloquent implemented Facade
            userProvider.updateRememberToken({
                getRememberTokenName() {
                    return 'remember_me';
                },
                getAuthIdentifierName() {
                    return 'id';
                },
                getAuthIdentifier() {
                    return '000000000000000000000000';
                }
            }, 'test');
        });
    });
    describe('.retrieveByCredentials()', function () {
        it('returns undefined if the credentials is invalid', async function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            expect(await userProvider.retrieveByCredentials({})).toBeUndefined();
        });
        it('simply calls .where() with model.getAuthIdentifierName() then calls .first()', async function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            // TODO: update the test when Eloquent implemented Facade
            const whereSpy = Sinon.spy(userProvider.model, 'where');
            userProvider.retrieveByCredentials({ email: 'test', password: 'test' });
            expect(whereSpy.calledWith('email', 'test')).toBe(true);
        });
    });
    describe('.validateCredentials()', function () {
        it('returns true if the password in user and hashed password in credentials is equal', async function () {
            const userProvider = new EloquentUserProvider_1.EloquentUserProvider();
            const user = new GenericUser_1.GenericUser();
            user.password = 'test';
            expect(await userProvider.validateCredentials(user, { password: 'test' })).toBe(true);
            expect(await userProvider.validateCredentials(user, { password: 'fail' })).toBe(false);
        });
    });
});
