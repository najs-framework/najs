/// <reference path="../contracts/types/redis.ts" />

import * as NodeRedis from 'redis'

export interface RedisPromise extends Redis.RedisPromise {}
export class RedisPromise {
  protected redisClient: NodeRedis.RedisClient

  constructor(redisClient: NodeRedis.RedisClient) {
    this.redisClient = redisClient
  }

  static promisify(method: string, redisClient: NodeRedis.RedisClient, args: ArrayLike<any>): Promise<any> {
    return <any>new Promise((resolve, reject) => {
      Reflect.apply(
        NodeRedis.RedisClient.prototype[method],
        redisClient,
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

// implements Redis.RedisPromise implicitly
const functions = Object.getOwnPropertyNames(NodeRedis.RedisClient.prototype)
for (const name of functions) {
  if (name === 'constructor') {
    continue
  }
  RedisPromise.prototype[name] = function() {
    return RedisPromise.promisify(name, this['redisClient'], arguments)
  }
}
