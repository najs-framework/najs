"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const Facade_1 = require("../facades/Facade");
const ConfigFacade_1 = require("../facades/global/ConfigFacade");
const register_1 = require("../core/register");
const Redis = require("redis");
class RedisClient extends Facade_1.Facade {
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
        return constants_1.GlobalFacadeClass.Redis;
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
    // -------------------------------------------------------------------------------------------------------------------
    /**
     * Append a value to a key.
     */
    append(key, value) {
        return this.redisClientProxy('append', arguments);
    }
    /**
     * Authenticate to the server.
     */
    auth(password) {
        return this.redisClientProxy('auth', arguments);
    }
    /**
     * Asynchronously rewrite the append-only file.
     */
    bgRewriteAOF() {
        return this.redisClientProxy('bgrewriteaof', arguments);
    }
    /**
     * Asynchronously save the dataset to disk.
     */
    bgSave() {
        return this.redisClientProxy('bgsave', arguments);
    }
    bitCount() {
        return this.redisClientProxy('bitcount', arguments);
    }
    bitField() {
        return this.redisClientProxy('bitfield', arguments);
    }
}
RedisClient.className = constants_1.GlobalFacadeClass.Redis;
exports.RedisClient = RedisClient;
register_1.register(RedisClient);
