import { IAutoload } from './../core/IAutoload';
import { IRedis } from './IRedis';
import { Facade } from '../facades/Facade';
import * as Redis from 'redis';
export declare class RedisClient extends Facade implements IRedis, IAutoload {
    static className: string;
    protected bucket: {
        [key: string]: Redis.RedisClient;
    };
    protected currentBucket: string;
    constructor();
    getClassName(): string;
    createClient(name: string, options: Redis.ClientOpts): Redis.RedisClient;
    useClient(name: string): this;
    getClient(name: string): Redis.RedisClient;
    getCurrentClient(): string;
    hasClient(name: string): boolean;
    private redisClientProxy(method, args);
    /**
     * Append a value to a key.
     */
    append(key: string, value: string): Promise<number>;
    /**
     * Authenticate to the server.
     */
    auth(password: string): Promise<string>;
    /**
     * Asynchronously rewrite the append-only file.
     */
    bgRewriteAOF(): Promise<'OK'>;
    /**
     * Asynchronously save the dataset to disk.
     */
    bgSave(): Promise<string>;
    /**
     * Count set bits in a string.
     */
    bitCount(key: string): Promise<number>;
    bitCount(key: string, start: number, end: number): Promise<number>;
    /**
     * Perform arbitrary bitfield integer operations on strings.
     */
    bitField(key: string, arg: Array<string | number>): Promise<[number, number]>;
    bitField(key: string, ...args: Array<string | number>): Promise<[number, number]>;
}
