"use strict";
/// <reference path="../contracts/Redis.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const najs_facade_1 = require("najs-facade");
const ConfigFacade_1 = require("../facades/global/ConfigFacade");
const Redis = require("redis");
class RedisClient extends najs_facade_1.Facade {
    constructor() {
        super();
        this.bucket = {};
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
            this.bucket[name] = Redis.createClient(options);
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
    getClient(name) {
        if (!this.bucket[name]) {
            throw new Error(`RedisClient "${name}" is not found`);
        }
        return this.bucket[name];
    }
    getCurrentClient() {
        return this.currentBucket;
    }
    hasClient(name) {
        return !!this.bucket[name];
    }
    redisClientProxy(method, args) {
        return new Promise((resolve, reject) => {
            Reflect.apply(Redis.RedisClient.prototype[method], this.bucket[this.currentBucket], Array.from(args).concat([
                function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            ]));
        });
    }
}
RedisClient.className = constants_1.Najs.Redis.RedisClient;
exports.RedisClient = RedisClient;
// implements Najs.Contracts.Redis implicitly
const functions = Object.getOwnPropertyNames(Redis.RedisClient.prototype);
for (const name of functions) {
    if (name === 'constructor') {
        continue;
    }
    RedisClient.prototype[name] = function () {
        return this.redisClientProxy(name, arguments);
    };
}
najs_binding_1.register(RedisClient, constants_1.Najs.Redis.RedisClient);
