/// <reference path="../contracts/types/redis.d.ts" />
import * as NodeRedis from 'redis';
export interface RedisPromise extends Redis.RedisPromise {
}
export declare class RedisPromise {
    protected redisClient: NodeRedis.RedisClient;
    constructor(redisClient: NodeRedis.RedisClient);
    static promisify(method: string, redisClient: NodeRedis.RedisClient, args: ArrayLike<any>): Promise<any>;
}
