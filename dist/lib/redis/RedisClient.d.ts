/// <reference path="../contracts/Redis.d.ts" />
import { Facade } from 'najs-facade';
import { RedisPromise } from './RedisPromise';
import * as NodeRedis from 'redis';
export interface RedisClient extends Najs.Contracts.Redis<NodeRedis.RedisClient> {
}
export declare class RedisClient extends Facade {
    static className: string;
    protected bucket: {
        [key: string]: NodeRedis.RedisClient;
    };
    protected redisPromiseBucket: {
        [key: string]: RedisPromise;
    };
    protected currentBucket: string;
    protected proxy: any;
    constructor();
    getClassName(): string;
    createClient(name: string, options: Redis.ClientOpts): NodeRedis.RedisClient;
    useClient(name: string): this;
    getRedisClient(name: string): NodeRedis.RedisClient;
    getClient(name: string): Redis.RedisPromise;
    getCurrentClient(): string;
    hasClient(name: string): boolean;
}
