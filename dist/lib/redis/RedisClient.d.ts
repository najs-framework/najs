/// <reference path="../contracts/Redis.d.ts" />
import { Facade } from 'najs-facade';
import * as Redis from 'redis';
export interface RedisClient extends Najs.Contracts.Redis<Redis.RedisClient> {
}
export declare class RedisClient extends Facade {
    static className: string;
    protected bucket: {
        [key: string]: Redis.RedisClient;
    };
    protected currentBucket: string;
    protected proxy: any;
    constructor();
    getClassName(): string;
    createClient(name: string, options: Redis.ClientOpts): Redis.RedisClient;
    useClient(name: string): this;
    getClient(name: string): Redis.RedisClient;
    getCurrentClient(): string;
    hasClient(name: string): boolean;
    redisClientProxy(method: string, args: ArrayLike<any>): Promise<any>;
}
