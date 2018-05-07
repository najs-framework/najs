/// <reference path="../contracts/Cache.d.ts" />
import { Facade } from 'najs-facade';
import * as Redis from 'redis';
export declare class RedisCache extends Facade implements Najs.Contracts.Cache {
    static className: string;
    redis: Redis.RedisClient;
    constructor();
    getClassName(): string;
    get(key: string, defaultValue?: any): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<boolean>;
    has(key: string): Promise<boolean>;
    clear(key: string): Promise<boolean>;
    getTag(tag: string, key: string, defaultValue?: any): Promise<any>;
    setTag(tag: string | Array<string>, key: string, value: any, ttl?: number): Promise<any>;
    hasTag(tag: string, key?: string): Promise<boolean>;
    clearTag(tag: string): Promise<boolean>;
    cache(key: string, ttl: number, fallback: () => Promise<any>): Promise<any>;
    cacheByTag(tag: string | Array<string>, key: string, ttl: number, fallback: () => Promise<any>): Promise<any>;
}
