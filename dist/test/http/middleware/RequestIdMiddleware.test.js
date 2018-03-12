"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Middleware = require("../../../lib/http/middleware/RequestIdMiddleware");
describe('RequestIdMiddleware', function () {
    it('is fit for najs-binding', function () {
        expect(Middleware.RequestIdMiddleware.className).toEqual('Najs.RequestIdMiddleware');
    });
    describe('protected .parseIdentify()', function () {
        it('always returns "request-id"', function () {
            const middleware = new Middleware.RequestIdMiddleware('test');
            expect(middleware['parseIdentify']()).toEqual('request-id');
            expect(middleware['parseIdentify']('any', 'thing')).toEqual('request-id');
        });
    });
    describe('protected .parseLevel()', function () {
        it('always returns true', function () {
            const middleware = new Middleware.RequestIdMiddleware('test');
            expect(middleware['parseLevel']('app')).toEqual(true);
            expect(middleware['parseLevel']('test')).toEqual(true);
        });
    });
    describe('.createMiddleware()', function () {
        it('creates "RequestIdGenerator" only one time and returns it', function () {
            expect(Middleware.RequestIdGenerator).toBeUndefined();
            const middleware = new Middleware.RequestIdMiddleware('test');
            expect(middleware.createMiddleware() === Middleware.RequestIdGenerator).toBe(true);
            expect(typeof Middleware.RequestIdGenerator).toEqual('function');
            const tmp = Middleware.RequestIdGenerator;
            expect(middleware.createMiddleware() === tmp).toBe(true);
            expect(middleware.createMiddleware() === tmp).toBe(true);
            expect(middleware.createMiddleware() === tmp).toBe(true);
        });
    });
});
