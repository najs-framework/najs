import { IAutoload, register } from 'najs-binding'
import { ConfigurationKeys, GlobalFacadeClass } from '../constants'
import { Facade } from 'najs-facade'
import { ConfigFacade } from '../facades/global/ConfigFacade'
import * as Redis from 'redis'

export class RedisClient extends Facade implements IAutoload {
  static className: string = GlobalFacadeClass.Redis
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
    return this.createProxy()
  }

  getClassName() {
    return GlobalFacadeClass.Redis
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

  protected createProxy() {
    this.proxy = new Proxy(this, {
      get(target: RedisClient, key: string): any {
        if (key !== 'hasOwnProperty' && typeof Redis.RedisClient.prototype[key] === 'function') {
          return function() {
            return target.redisClientProxy(key, arguments)
          }
        }
        return target[key]
      }
    })
    return this.proxy
  }

  protected redisClientProxy(method: string, args: ArrayLike<any>): Promise<any> {
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
register(RedisClient)
