"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Register = require("../../lib/core/register");
const Make = require("../../lib/core/make");
const Bind = require("../../lib/core/bind");
const NajsFacade_1 = require("../../lib/core/NajsFacade");
const register_1 = require("../../lib/core/register");
const constants_1 = require("./../../lib/constants");
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
    port: 3000
};
describe('Najs', function () {
    describe('use(options: Object)', function () {
        it('assigns default options if use is not called', function () {
            expect(NajsFacade_1.NajsFacade['options']).toEqual(DefaultOptions);
        });
        it('assigns default options if options is empty', function () {
            NajsFacade_1.NajsFacade.use({});
            expect(NajsFacade_1.NajsFacade['options']).toEqual(DefaultOptions);
        });
        it('assigns default options if options is empty', function () {
            NajsFacade_1.NajsFacade.use({});
            expect(NajsFacade_1.NajsFacade['options']).toEqual(DefaultOptions);
        });
        it('applies options if argument is Partial<NajsOptions>', function () {
            NajsFacade_1.NajsFacade.use({ port: 30000 });
            expect(NajsFacade_1.NajsFacade['options']).toEqual(Object.assign({}, DefaultOptions, { port: 30000 }));
        });
        it('does not accepts IConfig which missing get()', function () {
            NajsFacade_1.NajsFacade.use({ has: 'any' });
            expect(NajsFacade_1.NajsFacade['config'] === config).toBe(false);
            expect(NajsFacade_1.NajsFacade['options']['has']).toEqual('any');
        });
        it('does not accepts IConfig which missing has()', function () {
            NajsFacade_1.NajsFacade.use({ get: 'any' });
            expect(NajsFacade_1.NajsFacade['config'] === config).toBe(false);
            expect(NajsFacade_1.NajsFacade['options']['get']).toEqual('any');
        });
        it('applies config if argument is IConfig', function () {
            NajsFacade_1.NajsFacade.use(config);
            expect(NajsFacade_1.NajsFacade['config'] === config).toBe(true);
        });
        it('reads and applies settings when config if argument is IConfig', function () {
            NajsFacade_1.NajsFacade.use(config);
            expect(NajsFacade_1.NajsFacade['config'] === config).toBe(true);
            expect(NajsFacade_1.NajsFacade['options']).toEqual(Object.assign({}, DefaultOptions, { port: 3001 }));
        });
    });
    describe('Najs.register()', function () {
        it('proxies register() function', function () {
            const registerSpy = Sinon.spy(Register, 'register');
            NajsFacade_1.NajsFacade.register(FakeHttpDriver);
            expect(registerSpy.calledWith(FakeHttpDriver)).toBe(true);
            NajsFacade_1.NajsFacade.register(Test, 'Test');
            expect(registerSpy.calledWith(Test, 'Test')).toBe(true);
            NajsFacade_1.NajsFacade.register(Test, 'Something', false);
            expect(registerSpy.calledWith(Test, 'Something', false)).toBe(true);
            NajsFacade_1.NajsFacade.register(Test, 'SomethingNew', true, false);
            expect(registerSpy.calledWith(Test, 'SomethingNew', true, false)).toBe(true);
        });
    });
    describe('Najs.make()', function () {
        it('proxies make() function', function () {
            const makeSpy = Sinon.spy(Make, 'make');
            NajsFacade_1.NajsFacade.make(Test);
            expect(makeSpy.calledWith(Test)).toBe(true);
            NajsFacade_1.NajsFacade.make('Test');
            expect(makeSpy.calledWith('Test')).toBe(true);
            NajsFacade_1.NajsFacade.make('Something', { data: 'any' });
            expect(makeSpy.calledWith('Something', { data: 'any' })).toBe(true);
        });
    });
    describe('Najs.bind()', function () {
        it('proxies bind() function', function () {
            const bindSpy = Sinon.spy(Bind, 'bind');
            NajsFacade_1.NajsFacade.bind('Cache', 'RedisCached');
            expect(bindSpy.calledWith('Cache', 'RedisCached')).toBe(true);
            const servicePoolInstanceCreator = function () { };
            NajsFacade_1.NajsFacade.bind('ServicePool', servicePoolInstanceCreator);
            expect(bindSpy.calledWith('ServicePool', servicePoolInstanceCreator)).toBe(true);
        });
    });
    describe('Najs.hasConfig()', function () {
        it('throws ReferenceError if config is not register yet', function () {
            NajsFacade_1.NajsFacade['config'] = undefined;
            try {
                NajsFacade_1.NajsFacade.hasConfig('test');
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
            expect(NajsFacade_1.NajsFacade.use(config).hasConfig('port')).toBe(true);
            expect(hasSpy.calledWith('port')).toBe(true);
            hasSpy.restore();
        });
    });
    describe('Najs.getConfig()', function () {
        it('throws ReferenceError if config is not register yet', function () {
            NajsFacade_1.NajsFacade['config'] = undefined;
            try {
                NajsFacade_1.NajsFacade.getConfig('test');
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
            expect(NajsFacade_1.NajsFacade.use(config).getConfig('port')).toBe(3001);
            expect(getSpy.calledWith('port')).toBe(true);
            getSpy.restore();
        });
        it('uses Najs.config.has() for checking key exist or not before using get', function () {
            const hasSpy = Sinon.spy(config, 'has');
            const getSpy = Sinon.spy(config, 'get');
            expect(NajsFacade_1.NajsFacade.use(config).getConfig('httpDriver', 'test')).toEqual('test');
            expect(hasSpy.calledWith('httpDriver')).toBe(true);
            expect(NajsFacade_1.NajsFacade.getConfig('port', 3002)).toEqual(3001);
            expect(hasSpy.calledWith('port')).toBe(true);
            expect(getSpy.calledWith('port')).toBe(true);
        });
    });
    describe('start(options?: Object)', function () {
        it('called use(options) if provided', function () {
            register_1.register(FakeHttpDriver, constants_1.HttpDriverClass);
            const useSpy = Sinon.spy(NajsFacade_1.NajsFacade, 'use');
            NajsFacade_1.NajsFacade.start({
                host: 'test.com'
            });
            expect(useSpy.calledWith({
                host: 'test.com'
            })).toBe(true);
        });
        it('use Najs.options if do not pass options', function () {
            NajsFacade_1.NajsFacade.use({
                host: 'test.com'
            });
            NajsFacade_1.NajsFacade.start();
        });
    });
});
