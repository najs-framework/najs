import { IAutoload } from 'najs-binding';
import { Facade } from 'najs-facade';
import * as Redis from 'redis';
export declare class RedisClient extends Facade implements IAutoload {
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
    protected createProxy(): any;
    protected redisClientProxy(method: string, args: ArrayLike<any>): Promise<any>;
}
