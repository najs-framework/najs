"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = require("../facades/Facade");
const ConfigFacade_1 = require("../facades/global/ConfigFacade");
const register_1 = require("../core/register");
const constants_1 = require("../constants");
const Redis = require("redis");
function get_tag_manage_key(tagName) {
    return `tag:${tagName}`;
}
function get_tag_value_key(tagName, key) {
    return `tag:${tagName}|${key}`;
}
class RedisCache extends Facade_1.Facade {
    constructor() {
        super();
        this.redis = Redis.createClient(ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Cache.redis, {
            host: 'localhost',
            port: 6379
        }));
    }
    getClassName() {
        return RedisCache.className;
    }
    async get(key, defaultValue) {
        return new Promise((resolve, reject) => {
            this.redis.GET(key, function (error, response) {
                if (error) {
                    return reject(error);
                }
                if (response === null && defaultValue) {
                    return resolve(defaultValue);
                }
                return resolve(JSON.parse(response));
            });
        });
    }
    async set(key, value, ttl) {
        return new Promise((resolve, reject) => {
            function callback(error, response) {
                if (error) {
                    return reject(error);
                }
                resolve(response === 'OK');
            }
            if (ttl) {
                return this.redis.SET(key, JSON.stringify(value), 'EX', ttl, callback);
            }
            return this.redis.SET(key, JSON.stringify(value), callback);
        });
    }
    async has(key) {
        return new Promise((resolve, reject) => {
            this.redis.EXISTS(key, function (error, response) {
                if (error) {
                    return reject(error);
                }
                resolve(response === 1);
            });
        });
    }
    async clear(key) {
        return new Promise((resolve, reject) => {
            this.redis.DEL(key, function (error, response) {
                if (error) {
                    return reject(error);
                }
                resolve(response > 0);
            });
        });
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
RedisCache.className = 'RedisCache';
exports.RedisCache = RedisCache;
register_1.register(RedisCache);
register_1.register(RedisCache, constants_1.GlobalFacade.Cache);
