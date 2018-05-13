"use strict";
/// <reference path="../contracts/types/redis.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const NodeRedis = require("redis");
class RedisPromise {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    static promisify(method, redisClient, args) {
        return new Promise((resolve, reject) => {
            Reflect.apply(NodeRedis.RedisClient.prototype[method], redisClient, Array.from(args).concat([
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
exports.RedisPromise = RedisPromise;
// implements Redis.RedisPromise implicitly
const functions = Object.getOwnPropertyNames(NodeRedis.RedisClient.prototype);
for (const name of functions) {
    if (name === 'constructor') {
        continue;
    }
    RedisPromise.prototype[name] = function () {
        return RedisPromise.promisify(name, this['redisClient'], arguments);
    };
}
