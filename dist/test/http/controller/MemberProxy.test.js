"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_facade_1 = require("najs-facade");
const LogFacade_1 = require("../../../lib/facades/global/LogFacade");
const MemberProxy_1 = require("../../../lib/http/controller/MemberProxy");
const isPromise_1 = require("../../../lib/private/isPromise");
describe('MemberProxy', function () {
    it('implements IAutoload', function () {
        const proxy = new MemberProxy_1.MemberProxy('test', {});
        expect(proxy.getClassName()).toEqual(MemberProxy_1.MemberProxy.className);
    });
    it('provides proxy for members which can be a function or variable', function () {
        const proxy = new MemberProxy_1.MemberProxy('test', {
            var: 'var',
            doSomething: function () {
                return 'something';
            }
        });
        expect(proxy.var).toEqual('var');
        expect(proxy.doSomething()).toEqual('something');
    });
    describe('constructor()', function () {
        it('initialize with a message, this message will be use for Log with warning level', function () {
            LogFacade_1.LogFacade.shouldReceive('warning')
                .withArgs('please use Middleware xxx before use .set()')
                .once();
            const proxy = new MemberProxy_1.MemberProxy('please use Middleware xxx before use .{{key}}()', {
                chainable: ['set']
            });
            expect(proxy.set()).toBeInstanceOf(MemberProxy_1.MemberProxy);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('extracts all members from settings with supported keys or not', function () {
            const proxy = new MemberProxy_1.MemberProxy('please use Middleware xxx before use .{{key}}()', {
                chainable: ['set', 'test'],
                returnTrue: ['ok', 'test'],
                returnUndefined: ['ok', 'undefined'],
                custom: 123,
                test: 123
            });
            expect(proxy['members']).toEqual(['set', 'test', 'ok', 'undefined', 'custom']);
        });
        it('returns instance of Proxy(MemberProxy) instead of MemberProxy', function () {
            const instance = new MemberProxy_1.MemberProxy('test', {});
            expect(instance).toBeInstanceOf(MemberProxy_1.MemberProxy);
            expect(instance === instance['proxy']).toBe(true);
        });
    });
    describe('.createProxy()', function () {
        it('returns undefined if the key not defined in settings', function () {
            const proxy = new MemberProxy_1.MemberProxy('please use Middleware xxx before use .{{key}}()', {
                chainable: ['set', 'test'],
                returnTrue: ['ok', 'test'],
                returnUndefined: ['ok', 'undefined'],
                custom: 123,
                test: 123
            });
            expect(proxy.custom).toEqual(123);
            expect(proxy.notFound).toBeUndefined();
        });
        it('returns a chainable function with Log.warning if it defined in chainable', function () {
            LogFacade_1.LogFacade.shouldReceive('warning')
                .withArgs('please use Middleware xxx before use .test()')
                .twice();
            const proxy = new MemberProxy_1.MemberProxy('please use Middleware xxx before use .{{key}}()', {
                chainable: ['test']
            });
            expect(proxy.test().test()).toBeInstanceOf(MemberProxy_1.MemberProxy);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('returns a function with returns undefined with Log.warning if it defined in returnUndefined', function () {
            LogFacade_1.LogFacade.shouldReceive('warning')
                .withArgs('please use Middleware xxx before use .test()')
                .once();
            const proxy = new MemberProxy_1.MemberProxy('please use Middleware xxx before use .{{key}}()', {
                returnUndefined: ['test']
            });
            expect(proxy.test()).toBeUndefined();
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('returns a function with returns undefined with Log.warning if it defined in returnTrue', function () {
            LogFacade_1.LogFacade.shouldReceive('warning')
                .withArgs('please use Middleware xxx before use .test()')
                .once();
            const proxy = new MemberProxy_1.MemberProxy('please use Middleware xxx before use .{{key}}()', {
                returnTrue: ['test']
            });
            expect(proxy.test()).toBe(true);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('returns a function with returns undefined with Log.warning if it defined in returnFalse', function () {
            LogFacade_1.LogFacade.shouldReceive('warning')
                .withArgs('please use Middleware xxx before use .test()')
                .once();
            const proxy = new MemberProxy_1.MemberProxy('please use Middleware xxx before use .{{key}}()', {
                returnFalse: ['test']
            });
            expect(proxy.test()).toBe(false);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('returns a function with returns undefined with Log.warning if it defined in returnEmptyObject', function () {
            LogFacade_1.LogFacade.shouldReceive('warning')
                .withArgs('please use Middleware xxx before use .test()')
                .once();
            const proxy = new MemberProxy_1.MemberProxy('please use Middleware xxx before use .{{key}}()', {
                returnEmptyObject: ['test']
            });
            expect(proxy.test()).toEqual({});
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('returns a function with returns undefined with Log.warning if it defined in returnPromiseUndefined', async function () {
            LogFacade_1.LogFacade.shouldReceive('warning')
                .withArgs('please use Middleware xxx before use .test()')
                .once();
            const proxy = new MemberProxy_1.MemberProxy('please use Middleware xxx before use .{{key}}()', {
                returnPromiseUndefined: ['test']
            });
            const result = proxy.test();
            expect(isPromise_1.isPromise(result)).toBe(true);
            expect(await result).toBeUndefined();
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
    });
});
