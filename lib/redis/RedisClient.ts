/// <reference path="../contracts/Redis.ts" />

import { register } from 'najs-binding'
import { ConfigurationKeys, Najs } from '../constants'
import { Facade } from 'najs-facade'
import { ConfigFacade } from '../facades/global/ConfigFacade'
import { RedisPromise } from './RedisPromise'
import * as NodeRedis from 'redis'

export interface RedisClient extends Najs.Contracts.Redis<NodeRedis.RedisClient> {}
export class RedisClient extends Facade {
  static className: string = Najs.Redis.RedisClient
  protected bucket: {
    [key: string]: NodeRedis.RedisClient
  }
  protected redisPromiseBucket: {
    [key: string]: RedisPromise
  }
  protected currentBucket: string
  protected proxy: any

  constructor() {
    super()
    this.bucket = {}
    this.redisPromiseBucket = {}
    this.createClient(
      'default',
      ConfigFacade.get(ConfigurationKeys.Redis, {
        host: 'localhost',
        port: 6379
      })
    )
    this.useClient('default')
  }

  getClassName() {
    return Najs.Redis.RedisClient
  }

  createClient(name: string, options: Redis.ClientOpts): NodeRedis.RedisClient {
    if (!this.bucket[name]) {
      this.bucket[name] = NodeRedis.createClient(options)
    }
    return this.bucket[name]
  }

  useClient(name: string): this {
    if (!this.bucket[name]) {
      throw new Error(`RedisClient "${name}" is not found`)
    }
    this.currentBucket = name
    return this
  }

  getRedisClient(name: string): NodeRedis.RedisClient {
    if (!this.bucket[name]) {
      throw new Error(`RedisClient "${name}" is not found`)
    }
    return this.bucket[name]
  }

  getClient(name: string): Redis.RedisPromise {
    if (typeof this.redisPromiseBucket[name] === 'undefined') {
      const redisClient = this.getRedisClient(name)
      this.redisPromiseBucket[name] = new RedisPromise(redisClient)
    }
    return this.redisPromiseBucket[name]
  }

  getCurrentClient(): string {
    return this.currentBucket
  }

  hasClient(name: string): boolean {
    return !!this.bucket[name]
  }
}

// implements Najs.Contracts.Redis implicitly
const functions = Object.getOwnPropertyNames(NodeRedis.RedisClient.prototype)
for (const name of functions) {
  if (name === 'constructor') {
    continue
  }
  RedisClient.prototype[name] = function() {
    return RedisPromise.promisify(name, this['bucket'][this['currentBucket']], arguments)
  }
}

register(RedisClient, Najs.Redis.RedisClient)
