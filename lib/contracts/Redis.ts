/// <reference path="types/redis.ts" />
namespace Najs.Contracts {
  export interface Redis<T> extends Redis.RedisPromise, Autoload {
    /**
     * Create new redis client with a name and use it as current client
     * @param name {string} name of redis client
     * @param options {Object} redis.createClient options
     */
    createClient(name: string, options: Redis.ClientOpts): T

    /**
     * Get native redis client
     * @param name {string} name of redis client
     */
    getRedisClient(name: string): T

    /**
     * Get wrapped redis client
     */
    getClient(name: string): Redis.RedisPromise

    /**
     * Determines that client with name has been created or not
     * @param name {string} name of redis client
     */
    hasClient(name: string): boolean

    /**
     * Switch current client which wrapped by this class
     * @param name {string} name of redis client
     */
    useClient(name: string): this

    /**
     * Get current redis client
     */
    getCurrentClient(): string
  }
}
