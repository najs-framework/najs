"use strict";
/// <reference path="../contracts/types/redis.ts" />
/// <reference path="../contracts/Cache.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const RedisFacade_1 = require("../facades/global/RedisFacade");
const constants_2 = require("../constants");
const ConfigFacade_1 = require("../facades/global/ConfigFacade");
function get_tag_manage_key(tagName) {
    return `tag:${tagName}`;
}
function get_tag_value_key(tagName, key) {
    return `tag:${tagName}|${key}`;
}
class RedisCache extends najs_facade_1.Facade {
    constructor() {
        super();
        const config = ConfigFacade_1.ConfigFacade.get(constants_2.ConfigurationKeys.Cache.redis, {
            name: 'cache',
            host: 'localhost',
            port: 6379
        });
        RedisFacade_1.Redis.createClient(config.name, config);
        this.redisClient = RedisFacade_1.Redis.getClient(config.name);
    }
    getClassName() {
        return constants_1.Najs.Cache.RedisCache;
    }
    async get(key, defaultValue) {
        const response = await this.redisClient.get(key);
        if (response === null && defaultValue) {
            return defaultValue;
        }
        return JSON.parse(response);
    }
    async set(key, value, ttl) {
        const response = ttl
            ? await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl)
            : await this.redisClient.set(key, JSON.stringify(value));
        return response === 'OK';
    }
    async has(key) {
        const response = await this.redisClient.exists(key);
        return response === 1;
    }
    async clear(key) {
        const response = await this.redisClient.del(key);
        return response > 0;
    }
    async getTag(tag, key, defaultValue) {
        return this.get(get_tag_value_key(tag, key), defaultValue);
    }
    async setTag(tag, key, value, ttl) {
        const tags = Array.isArray(tag) ? tag : [tag];
        for (const tagName of tags) {
            const manageKey = get_tag_manage_key(tagName);
            const valueKey = get_tag_value_key(tagName, key);
            const taggedKeys = await this.get(manageKey, []);
            if (taggedKeys.indexOf(key) === -1) {
                taggedKeys.push(key);
            }
            await this.set(valueKey, value, ttl);
            await this.set(manageKey, taggedKeys);
        }
        return true;
    }
    async hasTag(tag, key) {
        if (!key) {
            return this.has(get_tag_manage_key(tag));
        }
        return this.has(get_tag_value_key(tag, key));
    }
    async clearTag(tag) {
        const manageKey = get_tag_manage_key(tag);
        const taggedKeys = await this.get(manageKey, []);
        for (const key of taggedKeys) {
            await this.clear(get_tag_value_key(tag, key));
        }
        await this.clear(manageKey);
        return true;
    }
    async cache(key, ttl, fallback) {
        const hasKey = await this.has(key);
        if (hasKey) {
            return await this.get(key);
        }
        const value = await fallback.call(undefined);
        await this.set(key, value, ttl);
        return value;
    }
    async cacheByTag(tag, key, ttl, fallback) {
        const tags = Array.isArray(tag) ? tag : [tag];
        for (const tagName of tags) {
            const hasKey = await this.hasTag(tagName, key);
            if (hasKey) {
                return await this.getTag(tagName, key);
            }
        }
        const value = await fallback.call(undefined);
        await this.setTag(tags, key, value, ttl);
        return value;
    }
}
RedisCache.className = constants_1.Najs.Cache.RedisCache;
exports.RedisCache = RedisCache;
najs_binding_1.register(RedisCache, constants_1.Najs.Cache.RedisCache);
