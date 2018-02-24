"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Redis = require("redis");
const RedisCache_1 = require("../../lib/cache/RedisCache");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../lib/constants");
const najs_binding_1 = require("najs-binding");
const PREVENT_FLAKY_PADDING = 10;
describe('RedisCache', function () {
    const redis = Redis.createClient({
        host: 'localhost',
        port: 6379
    });
    it('extends from Facade so it definitely a FacadeClass', function () {
        const redisCache = new RedisCache_1.RedisCache();
        expect(redisCache).toBeInstanceOf(najs_facade_1.Facade);
        expect(redisCache.getClassName()).toEqual(RedisCache_1.RedisCache.className);
        expect(najs_binding_1.ClassRegistry.has(constants_1.GlobalFacadeClass.Cache)).toBe(true);
        expect(najs_binding_1.make(constants_1.GlobalFacadeClass.Cache)).toBeInstanceOf(RedisCache_1.RedisCache);
    });
    describe('.getClassName()', function () {
        it('implements IAutoload interface', function () {
            const redisCache = new RedisCache_1.RedisCache();
            expect(redisCache.getClassName()).toEqual(RedisCache_1.RedisCache.className);
        });
    });
    describe('.get() | .set() | .has() | .clear()', function () {
        it('.get() returns null if key not found', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            const value = await redisCache.get('not-found');
            expect(value).toBeNull();
        });
        it('.get() returns default value if key not found', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            let value = await redisCache.get('not-found', 'default');
            expect(value).toEqual('default');
            redisCache.set('found', 'test-cache');
            value = await redisCache.get('found', 'default');
            expect(value).toEqual('test-cache');
        });
        it('works with all kind of data such as object, string, number, boolean', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            const data = [
                'string',
                123,
                -123.456,
                true,
                false,
                new Date(2017, 7, 17),
                [1, 'test-cache', true],
                { test: 'string', bool: true, date: new Date(2017, 7, 17) }
            ];
            for (const value in data) {
                await redisCache.set('test-cache', value);
                const result = await redisCache.get('test-cache');
                expect(result).toEqual(value);
                expect(typeof result).toEqual(typeof value);
                expect(await redisCache.has('test-cache')).toBe(true);
                await redisCache.clear('test-cache');
                expect(await redisCache.has('test-cache')).toBe(false);
            }
        });
        it('.set() can set value without ttl (time to live - or duration)', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            await redisCache.set('test-cache', 'something');
            return new Promise(resolve => {
                redis.ttl('test-cache', function (error, response) {
                    expect(response).toEqual(-1);
                    resolve(true);
                });
            });
        });
        it('.set() can set value with ttl (time to live - or duration)', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            await redisCache.set('test-cache', 'something', 17);
            return new Promise(resolve => {
                redis.ttl('test-cache', function (error, response) {
                    // Flaky preventing: add some seconds padding
                    expect(response).toBeLessThanOrEqual(17);
                    expect(response).toBeGreaterThan(17 - PREVENT_FLAKY_PADDING);
                    redisCache.clear('test-cache');
                    resolve(true);
                });
            });
        });
    });
    describe('.getTag() | .setTag() | .hasTag() | .clearTag()', function () {
        it('.setTag() creates 2 keys, 1st one called "manage key", 2nd one called "value key"', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            await redisCache.setTag('tagName', 'key 1', 123);
            expect(await redisCache.has('tag:tagName')).toBe(true);
            expect(await redisCache.has('tag:tagName|key 1')).toBe(true);
        });
        it('.setTag() "manage key" which for holding all tagged keys and has no ttl', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            await redisCache.setTag('tagName', 'key 2', 123);
            expect(await redisCache.get('tag:tagName')).toEqual(['key 1', 'key 2']);
            return new Promise(resolve => {
                redis.ttl('tag:tagName', function (error, response) {
                    expect(response).toEqual(-1);
                    resolve(true);
                });
            });
        });
        it('.setTag() "value key" which contains value and has ttl if passed', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            // still key 2, we can override existing key
            await redisCache.setTag('tagName', 'key 2', 123, 17);
            expect(await redisCache.get('tag:tagName')).toEqual(['key 1', 'key 2']);
            return new Promise(resolve => {
                redis.ttl('tag:tagName|key 2', function (error, response) {
                    // Flaky preventing: add some seconds padding
                    expect(response).toBeLessThanOrEqual(17);
                    expect(response).toBeGreaterThan(17 - PREVENT_FLAKY_PADDING);
                    resolve(true);
                });
            });
        });
        it('.setTag() can tag a key with many tags', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            await redisCache.setTag(['a', 'b'], 'key', 123);
            expect(await redisCache.get('tag:a')).toEqual(['key']);
            expect(await redisCache.get('tag:a|key')).toEqual(123);
            expect(await redisCache.get('tag:b')).toEqual(['key']);
            expect(await redisCache.get('tag:b|key')).toEqual(123);
        });
        it('.hasTag() can check a tag existing or not', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            expect(await redisCache.hasTag('a')).toBe(true);
            expect(await redisCache.hasTag('b')).toBe(true);
            expect(await redisCache.hasTag('tagName')).toBe(true);
            expect(await redisCache.hasTag('not-found')).toBe(false);
        });
        it('.hasTag() can check a tag with key existing or not', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            expect(await redisCache.hasTag('a', 'key')).toBe(true);
            expect(await redisCache.hasTag('b', 'key')).toBe(true);
            expect(await redisCache.hasTag('tagName', 'key 1')).toBe(true);
            expect(await redisCache.hasTag('tagName', 'key 2')).toBe(true);
            expect(await redisCache.hasTag('tagName', 'key 3')).toBe(false);
            expect(await redisCache.hasTag('not-found', 'not-found')).toBe(false);
        });
        it('.getTag() can get tagged with key and return defaultValue if key not found', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            expect(await redisCache.getTag('a', 'key')).toEqual(123);
            expect(await redisCache.getTag('b', 'key')).toEqual(123);
            expect(await redisCache.getTag('tagName', 'key 1')).toEqual(123);
            expect(await redisCache.getTag('tagName', 'key 2', 'default')).toEqual(123);
            expect(await redisCache.getTag('tagName', 'key 3', 'default')).toEqual('default');
            expect(await redisCache.getTag('not-found', 'not-found')).toBeNull();
        });
        it('.clearTag() can clear all "manage key" and "value key" of tag', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            await redisCache.clearTag('tagName');
            expect(await redisCache.hasTag('a', 'key')).toBe(true);
            expect(await redisCache.hasTag('b', 'key')).toBe(true);
            expect(await redisCache.hasTag('tagName')).toBe(false);
            expect(await redisCache.hasTag('tagName', 'key 1')).toBe(false);
            expect(await redisCache.hasTag('tagName', 'key 2')).toBe(false);
            expect(await redisCache.hasTag('tagName', 'key 3')).toBe(false);
            expect(await redisCache.hasTag('c', 'not-found')).toBe(false);
            await redisCache.clearTag('a');
            expect(await redisCache.hasTag('a')).toBe(false);
            expect(await redisCache.hasTag('a', 'key')).toBe(false);
            await redisCache.clearTag('b');
            expect(await redisCache.hasTag('b')).toBe(false);
            expect(await redisCache.hasTag('b', 'key')).toBe(false);
        });
    });
    function createFallback(value) {
        return async function () {
            return new Promise(resolve => resolve(value));
        };
    }
    describe('.cache()', function () {
        it('returns value of fallback and set value to key if there is no cache', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            expect(await redisCache.cache('test-cache', 60, createFallback('anything'))).toEqual('anything');
            expect(await redisCache.get('test-cache')).toEqual('anything');
            return new Promise(resolve => {
                redis.ttl('test-cache', function (error, response) {
                    // Flaky preventing: add some seconds padding
                    expect(response).toBeLessThanOrEqual(60);
                    expect(response).toBeGreaterThan(60 - PREVENT_FLAKY_PADDING);
                    resolve(true);
                });
            });
        });
        it('returns value in cache if and never call of fallback if key exists', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            expect(await redisCache.set('test-cache', 'something', 17));
            expect(await redisCache.cache('test-cache', 60, createFallback('anything'))).toEqual('something');
            return new Promise(resolve => {
                redis.ttl('test-cache', function (error, response) {
                    // Flaky preventing: add some seconds padding
                    expect(response).toBeLessThanOrEqual(17);
                    expect(response).toBeGreaterThan(17 - PREVENT_FLAKY_PADDING);
                    resolve(true);
                });
            });
        });
    });
    describe('.cacheByTag()', function () {
        it('returns value of fallback and set value to key with tags if there is no cache', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            expect(await redisCache.cacheByTag(['c', 'd'], 'test-cache', 60, createFallback('anything'))).toEqual('anything');
            expect(await redisCache.getTag('c', 'test-cache')).toEqual('anything');
            expect(await redisCache.getTag('d', 'test-cache')).toEqual('anything');
            return new Promise(resolve => {
                redis.ttl('tag:c|test-cache', function (error, response) {
                    // Flaky preventing: add some seconds padding
                    expect(response).toBeLessThanOrEqual(60);
                    expect(response).toBeGreaterThan(60 - PREVENT_FLAKY_PADDING);
                    redis.ttl('tag:d|test-cache', async function (error, response) {
                        // Flaky preventing: add some seconds padding
                        expect(response).toBeLessThanOrEqual(60);
                        expect(response).toBeGreaterThan(60 - PREVENT_FLAKY_PADDING);
                        await redisCache.clearTag('c');
                        await redisCache.clearTag('d');
                        resolve(true);
                    });
                });
            });
        });
        it('returns the FIRST value if key is exists in any tag', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            expect(await redisCache.setTag('c', 'test-cache', 'something', 17));
            expect(await redisCache.setTag('d', 'test-cache', 'will skipped', 60));
            expect(await redisCache.cacheByTag('c', 'test-cache', 60, createFallback('anything'))).toEqual('something');
            return new Promise(resolve => {
                redis.ttl('tag:c|test-cache', function (error, response) {
                    // Flaky preventing: add some seconds padding
                    expect(response).toBeLessThanOrEqual(17);
                    expect(response).toBeGreaterThan(17 - PREVENT_FLAKY_PADDING);
                    redis.ttl('tag:d|test-cache', async function (error, response) {
                        // Flaky preventing: add some seconds padding
                        expect(response).toBeLessThanOrEqual(60);
                        expect(response).toBeGreaterThan(60 - PREVENT_FLAKY_PADDING);
                        await redisCache.clearTag('c');
                        await redisCache.clearTag('d');
                        resolve(true);
                    });
                });
            });
        });
    });
    describe('Errors handle', function () {
        const fakeRedis = {
            GET(key, callback) {
                callback(new Error('Fake GET'));
            },
            SET(key, value, typeOrCallback, ttl, callback) {
                if (typeof typeOrCallback === 'function') {
                    return typeOrCallback(new Error('Fake SET'));
                }
                callback(new Error('Fake SET'));
            },
            EXISTS(key, callback) {
                callback(new Error('Fake EXISTS'));
            },
            DEL(key, callback) {
                callback(new Error('Fake DEL'));
            }
        };
        it('returns promise reject if redis.GET() has error', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            redisCache.redis = fakeRedis;
            try {
                await redisCache.get('error');
            }
            catch (error) {
                expect(error.message).toEqual('Fake GET');
                return;
            }
            expect('should not reach this line').toEqual('hmm');
        });
        it('returns promise reject if redis.SET() has error', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            redisCache.redis = fakeRedis;
            try {
                await redisCache.set('error', 'any');
            }
            catch (error) {
                expect(error.message).toEqual('Fake SET');
                return;
            }
            expect('should not reach this line').toEqual('hmm');
        });
        it('returns promise reject if redis.EXISTS() has error', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            redisCache.redis = fakeRedis;
            try {
                await redisCache.has('error');
            }
            catch (error) {
                expect(error.message).toEqual('Fake EXISTS');
                return;
            }
            expect('should not reach this line').toEqual('hmm');
        });
        it('returns promise reject if redis.DEL() has error', async function () {
            const redisCache = new RedisCache_1.RedisCache();
            redisCache.redis = fakeRedis;
            try {
                await redisCache.clear('error');
            }
            catch (error) {
                expect(error.message).toEqual('Fake DEL');
                return;
            }
            expect('should not reach this line').toEqual('hmm');
        });
    });
});
