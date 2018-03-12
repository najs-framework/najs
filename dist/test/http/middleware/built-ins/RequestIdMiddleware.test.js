"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const Middleware = require("../../../../lib/http/middleware/built-ins/RequestIdMiddleware");
const ExpressMiddlewareBase_1 = require("../../../../lib/http/middleware/ExpressMiddlewareBase");
describe('RequestIdMiddleware', function () {
    it('extends ExpressMiddlewareBase', function () {
        const middleware = new Middleware.RequestIdMiddleware('test');
        expect(middleware).toBeInstanceOf(ExpressMiddlewareBase_1.ExpressMiddlewareBase);
    });
    it('implements IAutoload and register automatically', function () {
        const middleware = new Middleware.RequestIdMiddleware('test');
        expect(middleware.getClassName()).toEqual(Middleware.RequestIdMiddleware.className);
        expect(najs_binding_1.ClassRegistry.has(Middleware.RequestIdMiddleware.className)).toBe(true);
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
