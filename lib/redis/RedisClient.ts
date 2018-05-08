/// <reference path="../contracts/Redis.ts" />

import { register } from 'najs-binding'
import { ConfigurationKeys, Najs } from '../constants'
import { Facade } from 'najs-facade'
import { ConfigFacade } from '../facades/global/ConfigFacade'
import * as Redis from 'redis'

export interface RedisClient extends Najs.Contracts.Redis<Redis.RedisClient> {}
export class RedisClient extends Facade {
  static className: string = Najs.Redis.RedisClient
  protected bucket: {
    [key: string]: Redis.RedisClient
  }
  protected currentBucket: string
  protected proxy: any

  constructor() {
    super()
    this.bucket = {}
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

  createClient(name: string, options: Redis.ClientOpts): Redis.RedisClient {
    if (!this.bucket[name]) {
      this.bucket[name] = Redis.createClient(options)
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

  getClient(name: string): Redis.RedisClient {
    if (!this.bucket[name]) {
      throw new Error(`RedisClient "${name}" is not found`)
    }
    return this.bucket[name]
  }

  getCurrentClient(): string {
    return this.currentBucket
  }

  hasClient(name: string): boolean {
    return !!this.bucket[name]
  }

  redisClientProxy(method: string, args: ArrayLike<any>): Promise<any> {
    return <any>new Promise((resolve, reject) => {
      Reflect.apply(
        Redis.RedisClient.prototype[method],
        this.bucket[this.currentBucket],
        Array.from(args).concat([
          function(error: Error | null, result: any) {
            if (error) {
              return reject(error)
            }
            resolve(result)
          }
        ])
      )
    })
  }
}

// implements Najs.Contracts.Redis implicitly
const functions = Object.getOwnPropertyNames(Redis.RedisClient.prototype)
for (const name of functions) {
  if (name === 'constructor') {
    continue
  }
  RedisClient.prototype[name] = function() {
    return this.redisClientProxy(name, arguments)
  }
}

register(RedisClient, Najs.Redis.RedisClient)
