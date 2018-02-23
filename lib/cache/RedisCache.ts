import { Facade } from '../facades/Facade'
import { ConfigFacade } from '../facades/global/ConfigFacade'
import { ICache, CacheFallback } from './ICache'
import { IAutoload } from 'najs-binding'
import { register } from 'najs-binding'
import { GlobalFacadeClass, ConfigurationKeys } from '../constants'
import * as Redis from 'redis'

function get_tag_manage_key(tagName: string): string {
  return `tag:${tagName}`
}

function get_tag_value_key(tagName: string, key: string): string {
  return `tag:${tagName}|${key}`
}

export class RedisCache extends Facade implements ICache, IAutoload {
  static className: string = GlobalFacadeClass.Cache
  redis: Redis.RedisClient

  constructor() {
    super()
    this.redis = Redis.createClient(
      ConfigFacade.get(ConfigurationKeys.Cache.redis, {
        host: 'localhost',
        port: 6379
      })
    )
  }

  getClassName(): string {
    return RedisCache.className
  }

  async get(key: string): Promise<any>
  async get<T>(key: string): Promise<T>
  async get(key: string, defaultValue: any): Promise<any>
  async get<T>(key: string, defaultValue: T): Promise<T>
  async get(key: string, defaultValue?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.redis.GET(key, function(error, response) {
        if (error) {
          return reject(error)
        }
        if (response === null && defaultValue) {
          return resolve(defaultValue)
        }
        return resolve(JSON.parse(response))
      })
    })
  }

  async set(key: string, value: any): Promise<boolean>
  async set<T>(key: string, value: T): Promise<boolean>
  async set(key: string, value: any, ttl?: number): Promise<boolean>
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean>
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    return <Promise<boolean>>new Promise((resolve, reject) => {
      function callback(error: any, response: any) {
        if (error) {
          return reject(error)
        }
        resolve(response === 'OK')
      }

      if (ttl) {
        return this.redis.SET(key, JSON.stringify(value), 'EX', ttl, callback)
      }
      return this.redis.SET(key, JSON.stringify(value), callback)
    })
  }

  async has(key: string): Promise<boolean> {
    return <Promise<boolean>>new Promise((resolve, reject) => {
      this.redis.EXISTS(key, function(error, response) {
        if (error) {
          return reject(error)
        }
        resolve(response === 1)
      })
    })
  }

  async clear(key: string): Promise<boolean> {
    return <Promise<boolean>>new Promise((resolve, reject) => {
      this.redis.DEL(key, function(error, response) {
        if (error) {
          return reject(error)
        }
        resolve(response > 0)
      })
    })
  }

  async getTag(tag: string, key: string): Promise<any>
  async getTag<T>(tag: string, key: string): Promise<T>
  async getTag(tag: string, key: string, defaultValue: any): Promise<any>
  async getTag<T>(tag: string, key: string, defaultValue: T): Promise<any>
  async getTag(tag: string, key: string, defaultValue?: any): Promise<any> {
    return this.get(get_tag_value_key(tag, key), defaultValue)
  }

  async setTag(tag: string, key: string, value: any): Promise<boolean>
  async setTag(tag: Array<string>, key: string, value: any): Promise<boolean>
  async setTag(tag: string, key: string, value: any, ttl: number): Promise<boolean>
  async setTag(tag: Array<string>, key: string, value: any, ttl: number): Promise<boolean>
  async setTag(tag: string | Array<string>, key: string, value: any, ttl?: number): Promise<any> {
    const tags: Array<string> = Array.isArray(tag) ? tag : [tag]
    for (const tagName of tags) {
      const manageKey = get_tag_manage_key(tagName)
      const valueKey = get_tag_value_key(tagName, key)

      const taggedKeys: Array<string> = await this.get(manageKey, [])
      if (taggedKeys.indexOf(key) === -1) {
        taggedKeys.push(key)
      }

      await this.set(valueKey, value, ttl)
      await this.set(manageKey, taggedKeys)
    }
    return true
  }

  async hasTag(tag: string): Promise<boolean>
  async hasTag(tag: string, key: string): Promise<boolean>
  async hasTag(tag: string, key?: string): Promise<boolean> {
    if (!key) {
      return this.has(get_tag_manage_key(tag))
    }
    return this.has(get_tag_value_key(tag, key))
  }

  async clearTag(tag: string): Promise<boolean> {
    const manageKey: string = get_tag_manage_key(tag)
    const taggedKeys: Array<string> = await this.get(manageKey, [])
    for (const key of taggedKeys) {
      await this.clear(get_tag_value_key(tag, key))
    }
    await this.clear(manageKey)
    return true
  }

  async cache(key: string, ttl: number, fallback: CacheFallback<Promise<any>>): Promise<any>
  async cache<T>(key: string, ttl: number, fallback: CacheFallback<Promise<T>>): Promise<T>
  async cache(key: string, ttl: number, fallback: CacheFallback<Promise<any>>): Promise<any> {
    const hasKey: boolean = await this.has(key)
    if (hasKey) {
      return await this.get(key)
    }
    const value: any = await fallback.call(undefined)
    await this.set(key, value, ttl)
    return value
  }

  async cacheByTag<T>(tag: string, key: string, ttl: number, fallback: CacheFallback<Promise<T>>): Promise<T>
  async cacheByTag<T>(tag: Array<string>, key: string, ttl: number, fallback: CacheFallback<Promise<T>>): Promise<T>
  async cacheByTag(tag: string, key: string, ttl: number, fallback: CacheFallback<Promise<any>>): Promise<any>
  async cacheByTag(tag: Array<string>, key: string, ttl: number, fallback: CacheFallback<Promise<any>>): Promise<any>
  async cacheByTag(
    tag: string | Array<string>,
    key: string,
    ttl: number,
    fallback: CacheFallback<Promise<any>>
  ): Promise<any> {
    const tags: Array<string> = Array.isArray(tag) ? tag : [tag]
    for (const tagName of tags) {
      const hasKey: boolean = await this.hasTag(tagName, key)
      if (hasKey) {
        return await this.getTag(tagName, key)
      }
    }
    const value: any = await fallback.call(undefined)
    await this.setTag(tags, key, value, ttl)
    return value
  }
}
register(RedisCache)
register(RedisCache, GlobalFacadeClass.Cache)
