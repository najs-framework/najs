"use strict";
/// <reference path="../contracts/Redis.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const najs_facade_1 = require("najs-facade");
const ConfigFacade_1 = require("../facades/global/ConfigFacade");
const RedisPromise_1 = require("./RedisPromise");
const NodeRedis = require("redis");
class RedisClient extends najs_facade_1.Facade {
    constructor() {
        super();
        this.bucket = {};
        this.redisPromiseBucket = {};
        this.createClient('default', ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Redis, {
            host: 'localhost',
            port: 6379
        }));
        this.useClient('default');
    }
    getClassName() {
        return constants_1.Najs.Redis.RedisClient;
    }
    createClient(name, options) {
        if (!this.bucket[name]) {
            this.bucket[name] = NodeRedis.createClient(options);
        }
        return this.bucket[name];
    }
    useClient(name) {
        if (!this.bucket[name]) {
            throw new Error(`RedisClient "${name}" is not found`);
        }
        this.currentBucket = name;
        return this;
    }
    getRedisClient(name) {
        if (!this.bucket[name]) {
            throw new Error(`RedisClient "${name}" is not found`);
        }
        return this.bucket[name];
    }
    getClient(name) {
        if (typeof this.redisPromiseBucket[name] === 'undefined') {
            const redisClient = this.getRedisClient(name);
            this.redisPromiseBucket[name] = new RedisPromise_1.RedisPromise(redisClient);
        }
        return this.redisPromiseBucket[name];
    }
    getCurrentClient() {
        return this.currentBucket;
    }
    hasClient(name) {
        return !!this.bucket[name];
    }
}
RedisClient.className = constants_1.Najs.Redis.RedisClient;
exports.RedisClient = RedisClient;
// implements Najs.Contracts.Redis implicitly
const functions = Object.getOwnPropertyNames(NodeRedis.RedisClient.prototype);
for (const name of functions) {
    if (name === 'constructor') {
        continue;
    }
    RedisClient.prototype[name] = function () {
        return RedisPromise_1.RedisPromise.promisify(name, this['bucket'][this['currentBucket']], arguments);
    };
}
najs_binding_1.register(RedisClient, constants_1.Najs.Redis.RedisClient);
