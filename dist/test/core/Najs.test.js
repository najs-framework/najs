"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const Path = require("path");
const Application_1 = require("../../lib/core/Application");
const Najs_1 = require("../../lib/core/Najs");
const events_1 = require("events");
const lib_1 = require("../../lib");
describe('Najs', function () {
    it('is an instance of NajsFramework class which is not a public class', function () {
        expect(typeof Najs_1.Najs === 'object').toBe(true);
        class FakeHttpDriver {
            start() { }
        }
        FakeHttpDriver.className = lib_1.SystemClass.HttpDriver;
        Najs_1.Najs['app'].register(FakeHttpDriver);
    });
    describe('NajsFramework', function () {
        describe('constructor()', function () {
            it('initials cwd = ../../../../', function () {
                expect(Najs_1.Najs['cwd']).toEqual(Path.resolve(__dirname, '..', '..', '..', '..'));
            });
            it('initials "internalEventEmitter" = EventEmitter', function () {
                expect(Najs_1.Najs['internalEventEmitter']).toBeInstanceOf(events_1.EventEmitter);
            });
            it('initials "serviceProviders" = []', function () {
                expect(Najs_1.Najs['serviceProviders']).toEqual([]);
            });
            it('initials "app" = new Application()', function () {
                expect(Najs_1.Najs['app']).toBeInstanceOf(Application_1.Application);
            });
        });
        describe('.workingDirectory()', function () {
            it('is chain-able and sets "cwd" of application', function () {
                expect(Najs_1.Najs.workingDirectory('test') === Najs_1.Najs).toBe(true);
                expect(Najs_1.Najs['cwd']).toEqual('test');
            });
        });
        describe('.classes()', function () {
            it('is chain-able', function () {
                expect(Najs_1.Najs.classes() === Najs_1.Najs).toBe(true);
            });
            it('calls native .require(path) to load resources, path is resolved base on "cwd"', function () {
                Najs_1.Najs.workingDirectory(__dirname);
                expect(global['test_require_function_1']).toBeUndefined();
                expect(global['test_require_function_2']).toBeUndefined();
                Najs_1.Najs.classes('./files/require_one', './files/require_two');
                expect(global['test_require_function_1']).toEqual('require_function_1');
                expect(global['test_require_function_2']).toEqual('require_function_2');
            });
        });
        describe('.providers()', function () {
            it('calls .resolveProvider() and skipped if the result is undefined', function () {
                const resolveProviderStub = Sinon.stub(Najs_1.Najs, 'resolveProvider');
                resolveProviderStub.returns(undefined);
                expect(Najs_1.Najs['serviceProviders']).toHaveLength(0);
                Najs_1.Najs.providers(['test']);
                expect(Najs_1.Najs['serviceProviders']).toHaveLength(0);
                resolveProviderStub.restore();
            });
            it('calls .resolveProvider() and push to "serviceProviders" if the result is not undefined', function () {
                const result = {};
                const resolveProviderStub = Sinon.stub(Najs_1.Najs, 'resolveProvider');
                resolveProviderStub.returns(result);
                expect(Najs_1.Najs['serviceProviders']).toHaveLength(0);
                Najs_1.Najs.providers(['test']);
                expect(Najs_1.Najs['serviceProviders']).toHaveLength(1);
                expect(Najs_1.Najs['serviceProviders'][0] === result).toBe(true);
                Najs_1.Najs['serviceProviders'] = [];
                resolveProviderStub.restore();
            });
        });
        describe('.on()', function () {
            it('is chain-able and calls "internalEventEmitter".on(...)', function () {
                const internalEventEmitterOnSpy = Sinon.spy(Najs_1.Najs['internalEventEmitter'], 'on');
                const handler = () => { };
                expect(Najs_1.Najs.on('start', handler) === Najs_1.Najs).toBe(true);
                expect(internalEventEmitterOnSpy.calledWith('start', handler)).toBe(true);
                internalEventEmitterOnSpy.restore();
            });
        });
        describe('.start()', function () {
            it('fires event "start" then calls registerServiceProviders, then bootServiceProviders() and fires "started"', async function () {
                const registerServiceProvidersSpy = Sinon.spy(Najs_1.Najs, 'registerServiceProviders');
                const bootServiceProvidersSpy = Sinon.spy(Najs_1.Najs, 'bootServiceProviders');
                const fireEventIfNeededSpy = Sinon.spy(Najs_1.Najs, 'fireEventIfNeeded');
                await Najs_1.Najs.start();
                expect(registerServiceProvidersSpy.called).toBe(true);
                expect(bootServiceProvidersSpy.called).toBe(true);
                expect(fireEventIfNeededSpy.firstCall.args[0] === 'start').toBe(true);
                expect(fireEventIfNeededSpy.firstCall.args[1] === Najs_1.Najs).toBe(true);
                expect(fireEventIfNeededSpy.secondCall.args[0] === 'started').toBe(true);
                expect(fireEventIfNeededSpy.secondCall.args[1] === Najs_1.Najs).toBe(true);
                registerServiceProvidersSpy.restore();
                bootServiceProvidersSpy.restore();
                fireEventIfNeededSpy.restore();
            });
            it('calls handleError() if there is any error', async function () {
                Najs_1.Najs['serviceProviders'] = [{}];
                const handleErrorStub = Sinon.stub(Najs_1.Najs, 'handleError');
                await Najs_1.Najs.start();
                expect(handleErrorStub.called).toBe(true);
                handleErrorStub.restore();
                Najs_1.Najs['serviceProviders'] = [];
            });
        });
        describe('protected .handleError()', function () {
            beforeAll(function () {
                Najs_1.Najs['serviceProviders'] = [{}];
            });
            afterAll(function () {
                Najs_1.Najs['serviceProviders'] = [];
            });
            it('fires event "crash" and returns if there is a handler', async function () {
                const eventEmitter = new events_1.EventEmitter();
                const emitSpy = Sinon.spy(eventEmitter, 'emit');
                Najs_1.Najs['internalEventEmitter'] = eventEmitter;
                eventEmitter.on('crash', () => { });
                try {
                    await Najs_1.Najs.start();
                }
                catch (error) {
                    expect('should not reach here').toEqual('hmm');
                }
                expect(emitSpy.called).toBe(true);
            });
            it('fires event "crashed" and returns if there is a handler', async function () {
                const eventEmitter = new events_1.EventEmitter();
                const emitSpy = Sinon.spy(eventEmitter, 'emit');
                Najs_1.Najs['internalEventEmitter'] = eventEmitter;
                eventEmitter.on('crashed', () => { });
                try {
                    await Najs_1.Najs.start();
                }
                catch (error) {
                    expect('should not reach here').toEqual('hmm');
                }
                expect(emitSpy.called).toBe(true);
            });
            it('throws error if there is no "crash"/"crashed" event handler', async function () {
                Najs_1.Najs['internalEventEmitter'] = new events_1.EventEmitter();
                try {
                    await Najs_1.Najs.start();
                }
                catch (error) {
                    expect(error).toBeInstanceOf(Error);
                    return;
                }
                expect('should not reach here').toEqual('hmm');
            });
        });
        describe('protected .resolveProvider()', function () {
            it('calls make() if provider is a string', function () {
                const makeStub = Sinon.stub(NajsBinding, 'make');
                Najs_1.Najs['resolveProvider']('ClassName');
                const call = makeStub.getCalls()[0];
                expect(call.args[0] === 'ClassName').toBe(true);
                expect(call.args[1][0] === Najs_1.Najs['app']).toBe(true);
                makeStub.restore();
            });
            it('calls Reflect.construct() if provider is typeof ServiceProvider', function () {
                const fakeServiceProvider = function (app, func) { };
                const constructStub = Sinon.stub(Reflect, 'construct');
                Najs_1.Najs['resolveProvider'](fakeServiceProvider);
                const call = constructStub.getCalls()[0];
                expect(call.args[0] === fakeServiceProvider).toBe(true);
                expect(call.args[1][0] === Najs_1.Najs['app']).toBe(true);
                constructStub.restore();
            });
        });
        describe('protected .registerServiceProviders()', function () {
            it('loops "serviceProviders" and call ServiceProvider.register(), fire "registered" for each one', async function () {
                const ServiceProviderOne = { async register() { } };
                const ServiceProviderTwo = { async register() { } };
                const registerOneSpy = Sinon.spy(ServiceProviderOne, 'register');
                const registerTwoSpy = Sinon.spy(ServiceProviderTwo, 'register');
                const fireEventIfNeededSpy = Sinon.spy(Najs_1.Najs, 'fireEventIfNeeded');
                Najs_1.Najs['serviceProviders'] = [ServiceProviderOne, ServiceProviderTwo];
                await Najs_1.Najs['registerServiceProviders']();
                expect(registerOneSpy.called).toBe(true);
                expect(registerTwoSpy.called).toBe(true);
                expect(fireEventIfNeededSpy.firstCall.args[0] === 'registered').toBe(true);
                expect(fireEventIfNeededSpy.firstCall.args[1] === Najs_1.Najs).toBe(true);
                expect(fireEventIfNeededSpy.firstCall.args[2] === ServiceProviderOne).toBe(true);
                expect(fireEventIfNeededSpy.secondCall.args[0] === 'registered').toBe(true);
                expect(fireEventIfNeededSpy.secondCall.args[1] === Najs_1.Najs).toBe(true);
                expect(fireEventIfNeededSpy.secondCall.args[2] === ServiceProviderTwo).toBe(true);
                fireEventIfNeededSpy.restore();
            });
        });
        describe('protected .bootServiceProviders()', function () {
            it('loops "serviceProviders" and call ServiceProvider.register(), fire "registered" for each one', async function () {
                const ServiceProviderOne = { async boot() { } };
                const ServiceProviderTwo = { async boot() { } };
                const bootOneSpy = Sinon.spy(ServiceProviderOne, 'boot');
                const bootTwoSpy = Sinon.spy(ServiceProviderTwo, 'boot');
                const fireEventIfNeededSpy = Sinon.spy(Najs_1.Najs, 'fireEventIfNeeded');
                Najs_1.Najs['serviceProviders'] = [ServiceProviderOne, ServiceProviderTwo];
                await Najs_1.Najs['bootServiceProviders']();
                expect(bootOneSpy.called).toBe(true);
                expect(bootTwoSpy.called).toBe(true);
                expect(fireEventIfNeededSpy.firstCall.args[0] === 'booted').toBe(true);
                expect(fireEventIfNeededSpy.firstCall.args[1] === Najs_1.Najs).toBe(true);
                expect(fireEventIfNeededSpy.firstCall.args[2] === ServiceProviderOne).toBe(true);
                expect(fireEventIfNeededSpy.secondCall.args[0] === 'booted').toBe(true);
                expect(fireEventIfNeededSpy.secondCall.args[1] === Najs_1.Najs).toBe(true);
                expect(fireEventIfNeededSpy.secondCall.args[2] === ServiceProviderTwo).toBe(true);
                fireEventIfNeededSpy.restore();
            });
        });
        describe('protected .fireEventIfNeeded()', function () {
            it('fire event of "internalEventEmitter" if has handlers and returns true, otherwise returns false', function () {
                const eventEmitter = new events_1.EventEmitter();
                const emitSpy = Sinon.spy(eventEmitter, 'emit');
                Najs_1.Najs['internalEventEmitter'] = eventEmitter;
                expect(Najs_1.Najs['fireEventIfNeeded']('test')).toBe(false);
                eventEmitter.on('test', function () { });
                expect(Najs_1.Najs['fireEventIfNeeded']('test', 'something')).toBe(true);
                expect(emitSpy.calledWith('test', 'something')).toBe(true);
            });
        });
    });
});
