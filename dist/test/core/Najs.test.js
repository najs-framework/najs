"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Register = require("../../lib/core/register");
const Make = require("../../lib/core/make");
const Bind = require("../../lib/core/bind");
const Najs_1 = require("../../lib/core/Najs");
class Test {
}
Test.className = 'Test';
class FakeHttpDriver {
    start(options) { }
}
FakeHttpDriver.className = 'FakeHttpDriver';
const config = {
    get(setting) {
        if (setting === 'port') {
            return 3001;
        }
        return undefined;
    },
    has(setting) {
        if (setting === 'port') {
            return true;
        }
        return false;
    },
    util: {}
};
const DefaultOptions = {
    port: 3000,
    host: 'localhost',
    httpDriver: 'ExpressHttpDriver'
};
describe('Najs', function () {
    describe('use(options: Object)', function () {
        it('assigns default options if use is not called', function () {
            expect(Najs_1.Najs['options']).toEqual(DefaultOptions);
        });
        it('assigns default options if options is empty', function () {
            Najs_1.Najs.use({});
            expect(Najs_1.Najs['options']).toEqual(DefaultOptions);
        });
        it('assigns default options if options is empty', function () {
            Najs_1.Najs.use({});
            expect(Najs_1.Najs['options']).toEqual(DefaultOptions);
        });
        it('applies options if argument is Partial<NajsOptions>', function () {
            Najs_1.Najs.use({ port: 30000 });
            expect(Najs_1.Najs['options']).toEqual(Object.assign({}, DefaultOptions, { port: 30000 }));
        });
        it('does not accepts IConfig which missing get()', function () {
            Najs_1.Najs.use({ has: 'any' });
            expect(Najs_1.Najs['config'] === config).toBe(false);
            expect(Najs_1.Najs['options']['has']).toEqual('any');
        });
        it('does not accepts IConfig which missing has()', function () {
            Najs_1.Najs.use({ get: 'any' });
            expect(Najs_1.Najs['config'] === config).toBe(false);
            expect(Najs_1.Najs['options']['get']).toEqual('any');
        });
        it('applies config if argument is IConfig', function () {
            Najs_1.Najs.use(config);
            expect(Najs_1.Najs['config'] === config).toBe(true);
        });
        it('reads and applies settings when config if argument is IConfig', function () {
            Najs_1.Najs.use(config);
            expect(Najs_1.Najs['config'] === config).toBe(true);
            expect(Najs_1.Najs['options']).toEqual(Object.assign({}, DefaultOptions, { port: 3001 }));
        });
    });
    describe('Najs.register()', function () {
        it('proxies register() function', function () {
            const registerSpy = Sinon.spy(Register, 'register');
            Najs_1.Najs.register(FakeHttpDriver);
            expect(registerSpy.calledWith(FakeHttpDriver)).toBe(true);
            Najs_1.Najs.register(Test, 'Test');
            expect(registerSpy.calledWith(Test, 'Test')).toBe(true);
            Najs_1.Najs.register(Test, 'Something', false);
            expect(registerSpy.calledWith(Test, 'Something', false)).toBe(true);
            Najs_1.Najs.register(Test, 'SomethingNew', true, false);
            expect(registerSpy.calledWith(Test, 'SomethingNew', true, false)).toBe(true);
        });
    });
    describe('Najs.make()', function () {
        it('proxies make() function', function () {
            const makeSpy = Sinon.spy(Make, 'make');
            Najs_1.Najs.make(Test);
            expect(makeSpy.calledWith(Test)).toBe(true);
            Najs_1.Najs.make('Test');
            expect(makeSpy.calledWith('Test')).toBe(true);
            Najs_1.Najs.make('Something', { data: 'any' });
            expect(makeSpy.calledWith('Something', { data: 'any' })).toBe(true);
        });
    });
    describe('Najs.bind()', function () {
        it('proxies bind() function', function () {
            const bindSpy = Sinon.spy(Bind, 'bind');
            Najs_1.Najs.bind('Cache', 'RedisCached');
            expect(bindSpy.calledWith('Cache', 'RedisCached')).toBe(true);
            const servicePoolInstanceCreator = function () { };
            Najs_1.Najs.bind('ServicePool', servicePoolInstanceCreator);
            expect(bindSpy.calledWith('ServicePool', servicePoolInstanceCreator)).toBe(true);
        });
    });
    describe('Najs.hasConfig()', function () {
        it('throws ReferenceError if config is not register yet', function () {
            Najs_1.Najs['config'] = undefined;
            try {
                Najs_1.Najs.hasConfig('test');
            }
            catch (error) {
                expect(error).toBeInstanceOf(ReferenceError);
                expect(error.message).toEqual('Please register config instance firstly: Najs.use(require("config"))');
                return;
            }
            expect('should not reach this line').toEqual('hum');
        });
        it('proxies Najs.config.has() function', function () {
            const hasSpy = Sinon.spy(config, 'has');
            expect(Najs_1.Najs.use(config).hasConfig('port')).toBe(true);
            expect(hasSpy.calledWith('port')).toBe(true);
            hasSpy.restore();
        });
    });
    describe('Najs.getConfig()', function () {
        it('throws ReferenceError if config is not register yet', function () {
            Najs_1.Najs['config'] = undefined;
            try {
                Najs_1.Najs.getConfig('test');
            }
            catch (error) {
                expect(error).toBeInstanceOf(ReferenceError);
                expect(error.message).toEqual('Please register config instance firstly: Najs.use(require("config"))');
                return;
            }
            expect('should not reach this line').toEqual('hum');
        });
        it('proxies Najs.config.get() directly if there is no default value', function () {
            const getSpy = Sinon.spy(config, 'get');
            expect(Najs_1.Najs.use(config).getConfig('port')).toBe(3001);
            expect(getSpy.calledWith('port')).toBe(true);
            getSpy.restore();
        });
        it('uses Najs.config.has() for checking key exist or not before using get', function () {
            const hasSpy = Sinon.spy(config, 'has');
            const getSpy = Sinon.spy(config, 'get');
            expect(Najs_1.Najs.use(config).getConfig('httpDriver', 'test')).toEqual('test');
            expect(hasSpy.calledWith('httpDriver')).toBe(true);
            expect(Najs_1.Najs.getConfig('port', 3002)).toEqual(3001);
            expect(hasSpy.calledWith('port')).toBe(true);
            expect(getSpy.calledWith('port')).toBe(true);
        });
    });
    describe('start(options?: Object)', function () {
        it('called use(options) if provided', function () {
            const useSpy = Sinon.spy(Najs_1.Najs, 'use');
            Najs_1.Najs.start({
                httpDriver: FakeHttpDriver.className
            });
            expect(useSpy.calledWith({
                httpDriver: FakeHttpDriver.className
            })).toBe(true);
        });
        it('use Najs.options if do not pass options', function () {
            Najs_1.Najs.use({
                httpDriver: FakeHttpDriver.className
            });
            Najs_1.Najs.start();
        });
    });
});
