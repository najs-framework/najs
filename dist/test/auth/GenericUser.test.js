"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const GenericUser_1 = require("../../lib/auth/GenericUser");
const constants_1 = require("../../lib/constants");
const Crypto = require("crypto");
describe('GenericUser', function () {
    it('extends from Eloquent.Mongoose', function () {
        // const user = new GenericUser()
        // expect(user).toBeInstanceOf(Eloquent.Mongoose())
    });
    describe('.getClassName()', function () {
        it('returns "Najs.GenericUser"', function () {
            const user = new GenericUser_1.GenericUser();
            expect(user.getClassName()).toEqual(constants_1.AuthClass.GenericUser);
        });
    });
    describe('setter .password', function () {
        it('automatically hash password with SHA-512 algorithm', function () {
            const user = new GenericUser_1.GenericUser();
            user.password = 'test';
            const hash = Crypto.createHmac('sha512', user.password_salt);
            hash.update('test');
            const hashed = hash.digest('base64');
            expect(user.password).toBeUndefined();
            expect(user.getAuthPassword()).toEqual(hashed);
        });
    });
    describe('getter .password_salt', function () {
        it('automatically generates random string with base64 format, 32 chars length', function () {
            const user = new GenericUser_1.GenericUser();
            expect(user.password_salt).toHaveLength(32);
            expect(user.password_salt === user.password_salt).toBe(true);
        });
    });
    describe('.toObject()', function () {
        it('clears sensitive data: password, password_salt and remember_token out of the original result', function () {
            const user = new GenericUser_1.GenericUser();
            user.setAttribute('password', 'password');
            user.setAttribute('password_salt', 'password_salt');
            user.setAttribute('remember_token', 'remember_token');
            expect(user.toObject()).toEqual({ _id: user.id });
        });
    });
    describe('.toJson()', function () {
        it('clears sensitive data: password, password_salt and remember_token out of the original result', function () {
            const user = new GenericUser_1.GenericUser();
            user.setAttribute('password', 'password');
            user.setAttribute('password_salt', 'password_salt');
            user.setAttribute('remember_token', 'remember_token');
            expect(user.toJson()).toEqual({ id: user.id });
        });
    });
    describe('.getAuthIdentifierName()', function () {
        it('returns "id" literal string', function () {
            const user = new GenericUser_1.GenericUser();
            expect(user.getAuthIdentifierName()).toEqual('id');
        });
    });
    describe('.getAuthIdentifier()', function () {
        it('returns id value', function () {
            const user = new GenericUser_1.GenericUser();
            expect(user.getAuthIdentifier()).toEqual(user.id);
        });
    });
    describe('.getAuthPassword()', function () {
        it('returns password in attributes if the param is not provided', function () {
            const user = new GenericUser_1.GenericUser();
            user.setAttribute('password', 'test');
            expect(user.getAuthPassword()).toEqual('test');
        });
        it('returns hashed password if the param is provided', function () {
            const user = new GenericUser_1.GenericUser();
            user.setAttribute('password', 'test');
            expect(user.getAuthPassword('test')).not.toEqual('test');
        });
    });
    describe('.getRememberToken()', function () {
        it('returns remember_token value', function () {
            const user = new GenericUser_1.GenericUser();
            user.remember_token = 'test';
            expect(user.getRememberToken()).toEqual('test');
        });
    });
    describe('.setRememberToken()', function () {
        it('returns remember_token value', function () {
            const user = new GenericUser_1.GenericUser();
            user.setRememberToken('test');
            expect(user.remember_token).toEqual('test');
        });
    });
    describe('.getRememberTokenName()', function () {
        it('returns "remember_token" literal string', function () {
            const user = new GenericUser_1.GenericUser();
            expect(user.getRememberTokenName()).toEqual('remember_token');
        });
    });
});
