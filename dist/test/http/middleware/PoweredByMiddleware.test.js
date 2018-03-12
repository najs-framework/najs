"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Middleware = require("../../../lib/http/middleware/PoweredByMiddleware");
describe('PoweredByMiddleware', function () {
    it('is fit for najs-binding', function () {
        expect(Middleware.PoweredByMiddleware.className).toEqual('Najs.PoweredByMiddleware');
    });
    describe('protected .parseIdentify()', function () {
        it('always returns "powered-by"', function () {
            const middleware = new Middleware.PoweredByMiddleware('test', 'app');
            expect(middleware['parseIdentify']()).toEqual('powered-by');
            expect(middleware['parseIdentify']('any', 'thing')).toEqual('powered-by');
        });
    });
    describe('protected .parseLevel()', function () {
        it('always returns true', function () {
            const middleware = new Middleware.PoweredByMiddleware('test', 'app');
            expect(middleware['parseLevel']('app')).toEqual(true);
            expect(middleware['parseLevel']('test')).toEqual(true);
        });
    });
    describe('protected .parseParams()', function () {
        it('sets arguments in index #1 to poweredBy variable, otherwise use Najs/Express by default', function () {
            const middleware = new Middleware.PoweredByMiddleware('test', 'app');
            expect(middleware['parseParams']('app')).toEqual('Najs/Express');
            expect(middleware['parseParams']('test', 'Najs')).toEqual('Najs');
        });
    });
    describe('.createMiddleware()', function () {
        it('creates "PoweredBySetter" only one time and returns it', function () {
            expect(Middleware.PoweredBySetter).toBeUndefined();
            const middleware = new Middleware.PoweredByMiddleware('test');
            expect(middleware.createMiddleware() === Middleware.PoweredBySetter).toBe(true);
            expect(typeof Middleware.PoweredBySetter).toEqual('function');
            const tmp = Middleware.PoweredBySetter;
            expect(middleware.createMiddleware() === tmp).toBe(true);
            expect(middleware.createMiddleware() === tmp).toBe(true);
            expect(middleware.createMiddleware() === tmp).toBe(true);
        });
    });
    describe('PoweredBySetter', function () {
        it('simply calls setHeader("X-Powered-By", this.poweredBy)', function () {
            const response = { setHeader() { } };
            const next = () => { };
            const setHeaderSpy = Sinon.spy(response, 'setHeader');
            const nextSpy = Sinon.spy(next);
            Middleware.PoweredBySetter({}, response, nextSpy);
            expect(setHeaderSpy.calledWith('X-Powered-By', 'Najs/Express')).toBe(true);
            expect(nextSpy.called).toBe(true);
        });
    });
});
