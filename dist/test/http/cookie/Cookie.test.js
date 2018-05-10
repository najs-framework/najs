"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_facade_1 = require("najs-facade");
const Cookie_1 = require("../../../lib/http/cookie/Cookie");
const ExpressController_1 = require("../../../lib/http/controller/ExpressController");
const RequestDataReader_1 = require("../../../lib/http/request/RequestDataReader");
describe('Cookie', function () {
    it('extends ContextualFacade', function () {
        const controller = {};
        const cookie = new Cookie_1.Cookie(controller);
        expect(cookie).toBeInstanceOf(najs_facade_1.ContextualFacade);
    });
    it('implements Autoload contract with name "Najs.Http.Cookie"', function () {
        const controller = {};
        const cookie = new Cookie_1.Cookie(controller);
        expect(cookie.getClassName()).toEqual('Najs.Http.Cookie');
    });
    describe('constructor()', function () {
        it('assigns itself to controller', function () {
            const controller = {};
            const cookie = new Cookie_1.Cookie(controller);
            expect(controller['cookie'] === cookie).toBe(true);
        });
        it('gets cookies and signedCookies if the controller is ExpressController, merged 2 variables to data', function () {
            const cookies = { a: 1, b: 2 };
            const signedCookies = { c: 3, d: 4 };
            const request = { method: 'GET', cookies, signedCookies };
            const controller = Reflect.construct(ExpressController_1.ExpressController, [request]);
            const cookie = new Cookie_1.Cookie(controller);
            expect(cookie['data']).toEqual({ a: 1, b: 2, c: 3, d: 4 });
            expect(cookie['cookies'] === cookies).toBe(true);
            expect(cookie['signedCookies'] === signedCookies).toBe(true);
        });
        it('does nothing if the controller is not ExpressController', function () {
            const controller = {};
            const cookie = new Cookie_1.Cookie(controller);
            expect(cookie['data']).toBeUndefined();
            expect(cookie['cookies']).toBeUndefined();
            expect(cookie['signedCookies']).toBeUndefined();
        });
    });
    describe('.isSigned()', function () {
        it('returns true if path in signedCookies', function () {
            const cookies = { a: 1, b: 2 };
            const signedCookies = { c: 3, d: 4 };
            const request = { method: 'GET', cookies, signedCookies };
            const controller = Reflect.construct(ExpressController_1.ExpressController, [request]);
            const cookie = new Cookie_1.Cookie(controller);
            expect(cookie.isSigned('a')).toBe(false);
            expect(cookie.isSigned('c')).toBe(true);
        });
        it('returns true if all paths in signedCookies', function () {
            const cookies = { a: 1, b: 2 };
            const signedCookies = { c: 3, d: 4 };
            const request = { method: 'GET', cookies, signedCookies };
            const controller = Reflect.construct(ExpressController_1.ExpressController, [request]);
            const cookie = new Cookie_1.Cookie(controller);
            expect(cookie.isSigned('a')).toBe(false);
            expect(cookie.isSigned('c')).toBe(true);
            expect(cookie.isSigned('c', 'd')).toBe(true);
            expect(cookie.isSigned(['c', 'd'])).toBe(true);
            expect(cookie.isSigned('c', 'a', 'd')).toBe(false);
            expect(cookie.isSigned(['c', 'd'], 'a')).toBe(false);
        });
    });
    describe('.get()', function () {
        it('calls implementation of RequestDataReader.get()', function () {
            const requestDataReaderSpy = Sinon.spy(RequestDataReader_1.RequestDataReader.prototype.get, 'apply');
            const cookie = new Cookie_1.Cookie({});
            cookie['data'] = {};
            cookie.get('test');
            expect(requestDataReaderSpy.calledWith(cookie)).toBe(true);
            expect(Array.from(requestDataReaderSpy.firstCall.args[1])).toEqual(['test']);
            requestDataReaderSpy.restore();
        });
    });
    describe('.has()', function () {
        it('calls implementation of RequestDataReader.has() if there is no signed parameter', function () {
            const requestDataReaderSpy = Sinon.spy(RequestDataReader_1.RequestDataReader.prototype.has, 'apply');
            const cookie = new Cookie_1.Cookie({});
            cookie['data'] = {};
            cookie.has('test');
            expect(requestDataReaderSpy.calledWith(cookie)).toBe(true);
            expect(Array.from(requestDataReaderSpy.firstCall.args[1])).toEqual(['test']);
            requestDataReaderSpy.restore();
        });
        it('returns true if the item in "signedCookies" is present and is not falsy values, and param signed = true', function () {
            const cookie = new Cookie_1.Cookie({});
            cookie['signedCookies'] = {
                a: 0,
                b: 1,
                c: '',
                d: 'd',
                e: undefined,
                // tslint:disable-next-line
                f: null,
                g: false,
                h: true
            };
            expect(cookie.has('a', true)).toBe(false);
            expect(cookie.has('b', true)).toBe(true);
            expect(cookie.has('c', true)).toBe(false);
            expect(cookie.has('d', true)).toBe(true);
            expect(cookie.has('e', true)).toBe(false);
            expect(cookie.has('f', true)).toBe(false);
            expect(cookie.has('g', true)).toBe(false);
            expect(cookie.has('h', true)).toBe(true);
        });
        it('returns true if the item in "cookies" is present and is not falsy values, and param signed = false', function () {
            const cookie = new Cookie_1.Cookie({});
            cookie['cookies'] = {
                a: 0,
                b: 1,
                c: '',
                d: 'd',
                e: undefined,
                // tslint:disable-next-line
                f: null,
                g: false,
                h: true
            };
            expect(cookie.has('a', false)).toBe(false);
            expect(cookie.has('b', false)).toBe(true);
            expect(cookie.has('c', false)).toBe(false);
            expect(cookie.has('d', false)).toBe(true);
            expect(cookie.has('e', false)).toBe(false);
            expect(cookie.has('f', false)).toBe(false);
            expect(cookie.has('g', false)).toBe(false);
            expect(cookie.has('h', false)).toBe(true);
        });
    });
    describe('.exists()', function () {
        it('calls implementation of RequestDataReader.exists() if there is no signed parameter', function () {
            const requestDataReaderSpy = Sinon.spy(RequestDataReader_1.RequestDataReader.prototype.exists, 'apply');
            const cookie = new Cookie_1.Cookie({});
            cookie['data'] = {};
            cookie.exists('test');
            expect(requestDataReaderSpy.calledWith(cookie)).toBe(true);
            expect(Array.from(requestDataReaderSpy.firstCall.args[1])).toEqual(['test']);
            requestDataReaderSpy.restore();
        });
        it('returns true if the item in "signedCookies" is present and is not falsy values, and param signed = true', function () {
            const cookie = new Cookie_1.Cookie({});
            cookie['signedCookies'] = {
                a: 0,
                b: 1,
                c: '',
                d: 'd',
                e: undefined,
                // tslint:disable-next-line
                f: null,
                g: false,
                h: true
            };
            expect(cookie.exists('a', true)).toBe(true);
            expect(cookie.exists('b', true)).toBe(true);
            expect(cookie.exists('c', true)).toBe(true);
            expect(cookie.exists('d', true)).toBe(true);
            expect(cookie.exists('e', true)).toBe(true);
            expect(cookie.exists('f', true)).toBe(true);
            expect(cookie.exists('g', true)).toBe(true);
            expect(cookie.exists('h', true)).toBe(true);
        });
        it('returns true if the item in "cookies" is present and is not falsy values, and param signed = false', function () {
            const cookie = new Cookie_1.Cookie({});
            cookie['cookies'] = {
                a: 0,
                b: 1,
                c: '',
                d: 'd',
                e: undefined,
                // tslint:disable-next-line
                f: null,
                g: false,
                h: true
            };
            expect(cookie.exists('a', false)).toBe(true);
            expect(cookie.exists('b', false)).toBe(true);
            expect(cookie.exists('c', false)).toBe(true);
            expect(cookie.exists('d', false)).toBe(true);
            expect(cookie.exists('e', false)).toBe(true);
            expect(cookie.exists('f', false)).toBe(true);
            expect(cookie.exists('g', false)).toBe(true);
            expect(cookie.exists('h', false)).toBe(true);
        });
    });
    describe('.all()', function () {
        it('returns "data" if there is no signed param', function () {
            const data = {};
            const cookie = new Cookie_1.Cookie({});
            cookie['data'] = data;
            expect(cookie.all() === data).toBe(true);
        });
        it('returns "signedCookies" if there is signed param is true', function () {
            const data = {};
            const cookie = new Cookie_1.Cookie({});
            cookie['signedCookies'] = data;
            expect(cookie.all(true) === data).toBe(true);
        });
        it('returns "cookies" if there is signed param is false', function () {
            const data = {};
            const cookie = new Cookie_1.Cookie({});
            cookie['cookies'] = data;
            expect(cookie.all(false) === data).toBe(true);
        });
    });
    describe('.only()', function () {
        it('calls implementation of RequestDataReader.only()', function () {
            const requestDataReaderSpy = Sinon.spy(RequestDataReader_1.RequestDataReader.prototype.only, 'apply');
            const cookie = new Cookie_1.Cookie({});
            cookie['data'] = {};
            cookie.only('test', 'a', ['b', 'c']);
            expect(requestDataReaderSpy.calledWith(cookie)).toBe(true);
            expect(Array.from(requestDataReaderSpy.firstCall.args[1])).toEqual(['test', 'a', ['b', 'c']]);
            requestDataReaderSpy.restore();
        });
    });
    describe('.except()', function () {
        it('calls implementation of RequestDataReader.except()', function () {
            const requestDataReaderSpy = Sinon.spy(RequestDataReader_1.RequestDataReader.prototype.except, 'apply');
            const cookie = new Cookie_1.Cookie({});
            cookie['data'] = {};
            cookie.except('test', 'a', ['b', 'c']);
            expect(requestDataReaderSpy.calledWith(cookie)).toBe(true);
            expect(Array.from(requestDataReaderSpy.firstCall.args[1])).toEqual(['test', 'a', ['b', 'c']]);
            requestDataReaderSpy.restore();
        });
    });
    describe('.forget()', function () {
        it('is chain-able', function () {
            const response = { clearCookie() { } };
            const clearCookieSpy = Sinon.spy(response, 'clearCookie');
            const cookie = new Cookie_1.Cookie({ response });
            expect(cookie.forget('test') === cookie).toBe(true);
            clearCookieSpy.restore();
        });
        it('calls Response.clearCookie() with name only if there is no more param', function () {
            const response = { clearCookie() { } };
            const clearCookieSpy = Sinon.spy(response, 'clearCookie');
            const cookie = new Cookie_1.Cookie({ response });
            cookie.forget('test');
            expect(clearCookieSpy.calledWith('test')).toBe(true);
            clearCookieSpy.restore();
        });
        it('calls Response.clearCookie() with name and options if options provided', function () {
            const response = { clearCookie() { } };
            const clearCookieSpy = Sinon.spy(response, 'clearCookie');
            const cookie = new Cookie_1.Cookie({ response });
            const options = { signed: true };
            cookie.forget('test', options);
            expect(clearCookieSpy.calledWith('test', options)).toBe(true);
            clearCookieSpy.restore();
        });
        it('calls Response.clearCookie() with name and options.path if path provided', function () {
            const response = { clearCookie() { } };
            const clearCookieSpy = Sinon.spy(response, 'clearCookie');
            const cookie = new Cookie_1.Cookie({ response });
            cookie.forget('test', '/');
            expect(clearCookieSpy.calledWith('test', { path: '/' })).toBe(true);
            clearCookieSpy.restore();
        });
        it('calls Response.clearCookie() with name and options.path+domain if path+domain provided', function () {
            const response = { clearCookie() { } };
            const clearCookieSpy = Sinon.spy(response, 'clearCookie');
            const cookie = new Cookie_1.Cookie({ response });
            cookie.forget('test', '/', 'najs.com');
            expect(clearCookieSpy.calledWith('test', { path: '/', domain: 'najs.com' })).toBe(true);
            clearCookieSpy.restore();
        });
    });
    describe('.make()', function () {
        it('is chain-able', function () {
            const response = { cookie() { } };
            const cookieSpy = Sinon.spy(response, 'cookie');
            const cookie = new Cookie_1.Cookie({ response });
            expect(cookie.make('name', 'value') === cookie).toBe(true);
            cookieSpy.restore();
        });
        it('calls Response.cookie() with empty option {signed: false} if has 2 params', function () {
            const response = { cookie() { } };
            const cookieSpy = Sinon.spy(response, 'cookie');
            const cookie = new Cookie_1.Cookie({ response });
            cookie.make('name', 'value');
            expect(cookieSpy.calledWith('name', 'value', { signed: false })).toBe(true);
            cookieSpy.restore();
        });
        it('calls Response.cookie() with and translate minute to maxAge if minute > 0', function () {
            const response = { cookie() { } };
            const cookieSpy = Sinon.spy(response, 'cookie');
            const cookie = new Cookie_1.Cookie({ response });
            cookie.make('name', 'value', true, 0);
            expect(cookieSpy.calledWith('name', 'value', { signed: true })).toBe(true);
            cookie.make('name', 'value', false, 2);
            expect(cookieSpy.calledWith('name', 'value', { signed: false, maxAge: 120000 })).toBe(true);
            cookieSpy.restore();
        });
        it('calls Response.cookie() with path in option if path is provided', function () {
            const response = { cookie() { } };
            const cookieSpy = Sinon.spy(response, 'cookie');
            const cookie = new Cookie_1.Cookie({ response });
            cookie.make('name', 'value', true, 0, '/');
            expect(cookieSpy.calledWith('name', 'value', { signed: true, path: '/' })).toBe(true);
            cookieSpy.restore();
        });
        it('calls Response.cookie() with domain in option if domain is provided', function () {
            const response = { cookie() { } };
            const cookieSpy = Sinon.spy(response, 'cookie');
            const cookie = new Cookie_1.Cookie({ response });
            cookie.make('name', 'value', true, 0, '/', 'najs.com');
            expect(cookieSpy.calledWith('name', 'value', { signed: true, path: '/', domain: 'najs.com' })).toBe(true);
            cookieSpy.restore();
        });
        it('calls Response.cookie() with secure in option if secure is provided', function () {
            const response = { cookie() { } };
            const cookieSpy = Sinon.spy(response, 'cookie');
            const cookie = new Cookie_1.Cookie({ response });
            cookie.make('name', 'value', true, 0, '/', 'najs.com', false);
            expect(cookieSpy.calledWith('name', 'value', { signed: true, path: '/', domain: 'najs.com', secure: false })).toBe(true);
            cookie.make('name', 'value', true, 0, '/', 'najs.com', true);
            expect(cookieSpy.calledWith('name', 'value', { signed: true, path: '/', domain: 'najs.com', secure: true })).toBe(true);
            cookieSpy.restore();
        });
        it('calls Response.cookie() with httpOnly in option if httpOnly is provided', function () {
            const response = { cookie() { } };
            const cookieSpy = Sinon.spy(response, 'cookie');
            const cookie = new Cookie_1.Cookie({ response });
            cookie.make('name', 'value', true, 0, '/', 'najs.com', false, true);
            expect(cookieSpy.calledWith('name', 'value', {
                signed: true,
                path: '/',
                domain: 'najs.com',
                secure: false,
                httpOnly: true
            })).toBe(true);
            cookie.make('name', 'value', true, 0, '/', 'najs.com', false, false);
            expect(cookieSpy.calledWith('name', 'value', {
                signed: true,
                path: '/',
                domain: 'najs.com',
                secure: false,
                httpOnly: false
            })).toBe(true);
            cookieSpy.restore();
        });
        it('calls Response.cookie() with option if it provided', function () {
            const response = { cookie() { } };
            const cookieSpy = Sinon.spy(response, 'cookie');
            const cookie = new Cookie_1.Cookie({ response });
            cookie.make('name', 'value', { signed: true, httpOnly: true });
            expect(cookieSpy.calledWith('name', 'value', { signed: true, httpOnly: true })).toBe(true);
            cookieSpy.restore();
        });
    });
    describe('.forever()', function () {
        it('is chain-able', function () {
            const response = { cookie() { } };
            const cookieSpy = Sinon.spy(response, 'cookie');
            const cookie = new Cookie_1.Cookie({ response });
            expect(cookie.forever('name', 'value') === cookie).toBe(true);
            cookieSpy.restore();
        });
        it('calls .make() with given param, except "minutes" = 5 years', function () {
            const response = { cookie() { } };
            const cookie = new Cookie_1.Cookie({ response });
            const makeSpy = Sinon.spy(cookie, 'make');
            const fiveYears = 5 * 365 * 24 * 60 * 60 * 1000;
            cookie.forever('name', 'value', true);
            expect(makeSpy.calledWith('name', 'value', true, fiveYears)).toBe(true);
            cookie.forever('name', 'value', true, '/');
            expect(makeSpy.calledWith('name', 'value', true, fiveYears, '/')).toBe(true);
            cookie.forever('name', 'value', true, '/', 'najs.com');
            expect(makeSpy.calledWith('name', 'value', true, fiveYears, '/', 'najs.com')).toBe(true);
            cookie.forever('name', 'value', true, '/', 'najs.com', false);
            expect(makeSpy.calledWith('name', 'value', true, fiveYears, '/', 'najs.com', false)).toBe(true);
            cookie.forever('name', 'value', true, '/', 'najs.com', false, true);
            expect(makeSpy.calledWith('name', 'value', true, fiveYears, '/', 'najs.com', false, true)).toBe(true);
            makeSpy.restore();
        });
        it('calls .make() and assigns maxAge = 5 years to options if options is an object', function () {
            const response = { cookie() { } };
            const cookie = new Cookie_1.Cookie({ response });
            const makeSpy = Sinon.spy(cookie, 'make');
            cookie.forever('name', 'value', { signed: true });
            expect(makeSpy.calledWith('name', 'value', { signed: true, maxAge: 5 * 365 * 24 * 60 * 60 * 1000 })).toBe(true);
            makeSpy.restore();
        });
    });
});
