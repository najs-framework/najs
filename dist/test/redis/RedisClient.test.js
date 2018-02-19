"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Redis = require("redis");
const Facade_1 = require("../../lib/facades/Facade");
const constants_1 = require("../../lib/constants");
const RedisClient_1 = require("../../lib/redis/RedisClient");
const ClassRegistry_1 = require("../../lib/core/ClassRegistry");
const isPromise_1 = require("../../lib/private/isPromise");
const constants_2 = require("../../lib/constants");
const ConfigFacade_1 = require("../../lib/facades/global/ConfigFacade");
const FacadeContainer_1 = require("../../lib/facades/FacadeContainer");
describe('RedisClient', function () {
    it('extends from Facade so it definitely a FacadeClass', function () {
        const redisClient = new RedisClient_1.RedisClient();
        expect(redisClient).toBeInstanceOf(Facade_1.Facade);
        expect(redisClient.getClassName()).toEqual(constants_1.GlobalFacadeClass.Redis);
        expect(ClassRegistry_1.ClassRegistry.has(constants_1.GlobalFacadeClass.Redis)).toBe(true);
    });
    describe('constructor()', function () {
        it('calls createClient() with default and config get from ConfigFacade', function () {
            ConfigFacade_1.ConfigFacade.shouldReceive('get').withArgs(constants_2.ConfigurationKeys.Redis, {
                host: 'localhost',
                port: 6379
            });
            const redisClient = new RedisClient_1.RedisClient();
            expect(redisClient.getCurrentClient()).toEqual('default');
            FacadeContainer_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
    });
    describe('.createClient()', function () {
        it('creates new client and put into bucket if the name is not exists', function () {
            const redisClient = new RedisClient_1.RedisClient();
            redisClient.createClient('test', {
                host: 'localhost',
                port: 6379
            });
            expect(typeof redisClient['bucket']['test'] === 'object').toBe(true);
        });
        it('does not creates new client the name is exists', function () {
            const redisClient = new RedisClient_1.RedisClient();
            redisClient.createClient('default', {
                host: 'localhost',
                port: 6379
            });
            expect(redisClient.getCurrentClient()).toEqual('default');
            expect(typeof redisClient['bucket']['test'] === 'undefined').toBe(true);
        });
        it('always return created/existing client', function () {
            const redisClient = new RedisClient_1.RedisClient();
            expect(redisClient.createClient('test', {
                host: 'localhost',
                port: 6379
            }) === redisClient['bucket']['test']).toBe(true);
            expect(redisClient.getCurrentClient()).toEqual('default');
        });
    });
    describe('.useClient()', function () {
        it('sets currentBucket to the name if it exists', function () {
            const redisClient = new RedisClient_1.RedisClient();
            redisClient.createClient('test', {
                host: 'localhost',
                port: 6379
            });
            expect(redisClient.useClient('test').getCurrentClient()).toEqual('test');
            expect(redisClient.useClient('default').getCurrentClient()).toEqual('default');
        });
        it('throws an Error if the name is not in bucket list', function () {
            const redisClient = new RedisClient_1.RedisClient();
            try {
                redisClient.useClient('test');
            }
            catch (error) {
                expect(error.message).toEqual('RedisClient "test" is not found');
                return;
            }
            expect('should not reach this line').toEqual('hm');
        });
    });
    describe('.getClient()', function () {
        it('returns native redis client if name exists', function () {
            const redisClient = new RedisClient_1.RedisClient();
            redisClient.createClient('test', {
                host: 'localhost',
                port: 6379
            });
            expect(redisClient.getClient('test') === redisClient['bucket']['test']).toBe(true);
        });
        it('throws an Error if the name is not in bucket list', function () {
            const redisClient = new RedisClient_1.RedisClient();
            try {
                redisClient.getClient('test');
            }
            catch (error) {
                expect(error.message).toEqual('RedisClient "test" is not found');
                return;
            }
            expect('should not reach this line').toEqual('hm');
        });
    });
    describe('.getCurrentClient()', function () {
        it('simply returns currentBucket', function () { });
    });
    describe('.hasClient()', function () {
        it('simply returns true if there is client with name in bucket', function () {
            const redisClient = new RedisClient_1.RedisClient();
            expect(redisClient.hasClient('default')).toBe(true);
            expect(redisClient.hasClient('test')).toBe(false);
        });
    });
    describe('protected .redisClientProxy()', function () {
        it('simply calls RedisClient.prototype[method] with custom callback', function () {
            const redisStub = Sinon.stub(Redis.RedisClient.prototype, 'get');
            const redisClient = new RedisClient_1.RedisClient();
            expect(isPromise_1.isPromise(redisClient['redisClientProxy']('get', ['test']))).toBe(true);
            expect(redisStub.calledWith('test')).toBe(true);
            expect(typeof redisStub.lastCall.args[1] === 'function').toBe(true);
            expect(redisStub.lastCall.thisValue === redisClient['bucket']['default']).toBe(true);
            redisClient.createClient('test', {
                host: 'localhost',
                port: 6379
            });
            redisClient.useClient('test');
            redisClient['redisClientProxy']('get', ['test']);
            expect(redisStub.lastCall.thisValue === redisClient['bucket']['test']).toBe(true);
            redisStub.restore();
        });
        it('calls Promise.resolve if there is no error', async function () {
            const redisClient = new RedisClient_1.RedisClient();
            const result = await redisClient['redisClientProxy']('append', ['test', 'a']);
            expect(result).toBeGreaterThan(0);
        });
        it('call Promise.reject if there is any error', async function () {
            const redisStub = Sinon.stub(Redis.RedisClient.prototype, 'get');
            try {
                redisStub.callsFake(function (key, done) {
                    done(new Error(key));
                });
                const redisClient = new RedisClient_1.RedisClient();
                await redisClient['redisClientProxy']('get', ['test']);
            }
            catch (error) {
                expect(error.message).toEqual('test');
                redisStub.restore();
                return;
            }
            expect('should not reach this line').toEqual('hm');
        });
    });
    // -------------------------------------------------------------------------------------------------------------------
    function redisClientProxy_test_for(facadeMethod, redisMethod, args) {
        describe('.' + facadeMethod + '()', function () {
            it('returns a promise', function () {
                const redisClient = new RedisClient_1.RedisClient();
                const redisClientProxyStub = Sinon.stub(redisClient, 'redisClientProxy');
                redisClientProxyStub.callsFake(async function () { });
                expect(isPromise_1.isPromise(redisClient[facadeMethod](...args))).toBe(true);
                redisClientProxyStub.restore();
            });
            it('calls .redisClientProxy(), passes method name and arguments', async function () {
                const redisClient = new RedisClient_1.RedisClient();
                const redisClientProxyStub = Sinon.stub(redisClient, 'redisClientProxy');
                redisClientProxyStub.callsFake(async function () {
                    return true;
                });
                redisClient[facadeMethod](...args);
                expect(redisClientProxyStub.calledWith(redisMethod)).toBe(true);
                expect(Array.from(redisClientProxyStub.lastCall.args[1])).toEqual(args);
            });
        });
    }
    redisClientProxy_test_for('append', 'append', ['test', 'abc']);
    redisClientProxy_test_for('auth', 'auth', ['password']);
    redisClientProxy_test_for('bgRewriteAOF', 'bgrewriteaof', []);
    redisClientProxy_test_for('bgSave', 'bgsave', []);
    redisClientProxy_test_for('bitCount', 'bitcount', ['test']);
    redisClientProxy_test_for('bitCount', 'bitcount', ['test', 1, 2]);
    redisClientProxy_test_for('bitField', 'bitfield', ['test', 1]);
    redisClientProxy_test_for('bitField', 'bitfield', ['test', [1]]);
    redisClientProxy_test_for('bitField', 'bitfield', ['test', ['test']]);
});
