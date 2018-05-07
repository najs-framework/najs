import { RedisCache } from './cache/RedisCache'

export type BuiltinClasses = {
  Cache: {
    RedisCache: typeof RedisCache
  }
}
