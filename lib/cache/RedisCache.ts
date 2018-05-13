/// <reference path="../contracts/Cache.ts" />

import { Facade } from 'najs-facade'
import { register } from 'najs-binding'
import { Najs } from '../constants'
import { Redis } from '../facades/global/RedisFacade'

function get_tag_manage_key(tagName: string): string {
  return `tag:${tagName}`
}

function get_tag_value_key(tagName: string, key: string): string {
  return `tag:${tagName}|${key}`
}

export class RedisCache extends Facade implements Najs.Contracts.Cache {
  static className: string = Najs.Cache.RedisCache

  constructor() {
    super()
  }

  getClassName(): string {
    return Najs.Cache.RedisCache
  }

  async get(key: string, defaultValue?: any): Promise<any> {
    const response = await Redis.get(key)
    if (response === null && defaultValue) {
      return defaultValue
    }
    return JSON.parse(response)
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    const response = ttl
      ? await Redis.set(key, JSON.stringify(value), 'EX', ttl)
      : await Redis.set(key, JSON.stringify(value))
    return response === 'OK'
  }

  async has(key: string): Promise<boolean> {
    const response = await Redis.exists(key)
    return response === 1
  }

  async clear(key: string): Promise<boolean> {
    const response = await Redis.del(key)
    return response > 0
  }

  async getTag(tag: string, key: string, defaultValue?: any): Promise<any> {
    return this.get(get_tag_value_key(tag, key), defaultValue)
  }

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

  async cache(key: string, ttl: number, fallback: () => Promise<any>): Promise<any> {
    const hasKey: boolean = await this.has(key)
    if (hasKey) {
      return await this.get(key)
    }
    const value: any = await fallback.call(undefined)
    await this.set(key, value, ttl)
    return value
  }

  async cacheByTag(tag: string | Array<string>, key: string, ttl: number, fallback: () => Promise<any>): Promise<any> {
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
register(RedisCache, Najs.Cache.RedisCache)
