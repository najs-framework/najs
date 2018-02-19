import { IAutoload } from './../core/IAutoload'
import { ConfigurationKeys, GlobalFacadeClass } from '../constants'
import { IRedis } from './IRedis'
import { Facade } from '../facades/Facade'
import { ConfigFacade } from '../facades/global/ConfigFacade'
import { register } from '../core/register'
import * as Redis from 'redis'

export class RedisClient extends Facade implements IRedis, IAutoload {
  static className: string = GlobalFacadeClass.Redis
  protected bucket: {
    [key: string]: Redis.RedisClient
  }
  protected currentBucket: string

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

  private redisClientProxy(method: string, args: ArrayLike<any>): Promise<any> {
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

  // -------------------------------------------------------------------------------------------------------------------
  /**
   * Append a value to a key.
   */
  append(key: string, value: string): Promise<number> {
    return this.redisClientProxy('append', arguments)
  }
  /**
   * Authenticate to the server.
   */
  auth(password: string): Promise<string> {
    return this.redisClientProxy('auth', arguments)
  }
  /**
   * Asynchronously rewrite the append-only file.
   */
  bgRewriteAOF(): Promise<'OK'> {
    return this.redisClientProxy('bgrewriteaof', arguments)
  }
  /**
   * Asynchronously save the dataset to disk.
   */
  bgSave(): Promise<string> {
    return this.redisClientProxy('bgsave', arguments)
  }
  /**
   * Count set bits in a string.
   */
  bitCount(key: string): Promise<number>
  bitCount(key: string, start: number, end: number): Promise<number>
  bitCount(): Promise<number> {
    return this.redisClientProxy('bitcount', arguments)
  }
  /**
   * Perform arbitrary bitfield integer operations on strings.
   */
  bitField(key: string, arg: Array<string | number>): Promise<[number, number]>
  bitField(key: string, ...args: Array<string | number>): Promise<[number, number]>
  bitField(): Promise<[number, number]> {
    return this.redisClientProxy('bitfield', arguments)
  }
}
register(RedisClient)
