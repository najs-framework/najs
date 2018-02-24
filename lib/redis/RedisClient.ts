import { IAutoload, register } from 'najs-binding'
import { ConfigurationKeys, GlobalFacadeClass } from '../constants'
import { IRedis } from './IRedis'
import { Facade } from 'najs-facade'
import { ConfigFacade } from '../facades/global/ConfigFacade'
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
   * Listen for all requests received by the server in real time.
   */
  monitor(): Promise<undefined> {
    return this.redisClientProxy('monitor', arguments)
  }

  /**
   * Get information and statistics about the server.
   */
  info(): Promise<Redis.ServerInfo>
  info(section?: string | string[]): Promise<Redis.ServerInfo>
  info(): Promise<Redis.ServerInfo> {
    return this.redisClientProxy('info', arguments)
  }

  /**
   * Ping the server.
   */
  ping(): Promise<string>
  ping(message: string): Promise<string>
  ping(): Promise<string> {
    return this.redisClientProxy('ping', arguments)
  }

  /**
   * Post a message to a channel.
   */
  publish(channel: string, value: string): Promise<number> {
    return this.redisClientProxy('publish', arguments)
  }

  /**
   * KILL - Kill the connection of a client.
   * LIST - Get the list of client connections.
   * GETNAME - Get the current connection name.
   * PAUSE - Stop processing commands from clients for some time.
   * REPLY - Instruct the server whether to reply to commands.
   * SETNAME - Set the current connection name.
   */
  client(...args: Array<string>): Promise<any> {
    return this.redisClientProxy('client', arguments)
  }

  /**
   * Set multiple hash fields to multiple values.
   */
  hmset(key: string): Promise<boolean>
  hmset(key: string, ...args: Array<string | number>): Promise<boolean>
  hmset(): Promise<boolean> {
    return this.redisClientProxy('hmset', arguments)
  }

  /**
   * Listen for messages published to the given channels.
   */
  subscribe(channel: string): Promise<string>
  subscribe(channels: string[]): Promise<string>
  subscribe(...args: string[]): Promise<string>
  subscribe(): Promise<string> {
    return this.redisClientProxy('subscribe', arguments)
  }

  /**
   * Stop listening for messages posted to the given channels.
   */
  unsubscribe(channel: string): Promise<string>
  unsubscribe(channels: string[]): Promise<string>
  unsubscribe(...args: string[]): Promise<string>
  unsubscribe(): Promise<string> {
    return this.redisClientProxy('unsubscribe', arguments)
  }

  /**
   * Listen for messages published to channels matching the given patterns.
   */
  psubscribe(channel: string): Promise<string>
  psubscribe(channels: string[]): Promise<string>
  psubscribe(...args: string[]): Promise<string>
  psubscribe(): Promise<string> {
    return this.redisClientProxy('psubscribe', arguments)
  }

  /**
   * Stop listening for messages posted to channels matching the given patterns.
   */
  punsubscribe(channel: string): Promise<string>
  punsubscribe(channels: string[]): Promise<string>
  punsubscribe(...args: string[]): Promise<string>
  punsubscribe(): Promise<string> {
    return this.redisClientProxy('punsubscribe', arguments)
  }

  /**
   * Authenticate to the server.
   */
  auth(password: string): Promise<string> {
    return this.redisClientProxy('auth', arguments)
  }

  /**
   * Append a value to a key.
   */
  append(key: string, value: string): Promise<number> {
    return this.redisClientProxy('append', arguments)
  }

  /**
   * Asynchronously rewrite the append-only file.
   */
  bgrewriteaof(): Promise<'OK'> {
    return this.redisClientProxy('bgrewriteaof', arguments)
  }

  /**
   * Asynchronously save the dataset to disk.
   */
  bgsave(): Promise<string> {
    return this.redisClientProxy('bgsave', arguments)
  }

  /**
   * Count set bits in a string.
   */
  bitcount(key: string): Promise<number>
  bitcount(key: string, start: number, end: number): Promise<number>
  bitcount(): Promise<number> {
    return this.redisClientProxy('bitcount', arguments)
  }

  /**
   * Perform arbitrary bitfield integer operations on strings.
   */
  bitfield(): Promise<[number, number]>
  bitfield(key: string): Promise<[number, number]>
  bitfield(key: string, ...args: Array<string | number>): Promise<[number, number]>
  bitfield(): Promise<[number, number]> {
    return this.redisClientProxy('bitfield', arguments)
  }

  /**
   * Perform bitwise operations between strings.
   */
  bitop(operation: string, destKey: string, args: string[]): Promise<number> {
    return this.redisClientProxy('bitop', arguments)
  }

  /**
   * Find first bit set or clear in a string.
   */
  bitpos(key: string, bit: number): Promise<number>
  bitpos(key: string, bit: number, start: number): Promise<number>
  bitpos(key: string, bit: number, start: number, end: number): Promise<number>
  bitpos(): Promise<number> {
    return this.redisClientProxy('bitpos', arguments)
  }

  /**
   * Remove and get the first element in a list, or block until one is available.
   */
  blpop(args: Array<string | number>): Promise<[string, string]>
  blpop(...args: Array<string | number>): Promise<[string, string]>
  blpop(arg1: string, arg2: number | Array<string | number>): Promise<[string, string]>
  blpop(arg1: string, arg2: string, arg3: number): Promise<[string, string]>
  blpop(arg1: string, arg2: string, arg3: string, arg4: number): Promise<[string, string]>
  blpop(arg1: string, arg2: string, arg3: string, arg4: string, arg5: number): Promise<[string, string]>
  blpop(arg1: string, arg2: string, arg3: string, arg4: string, arg5: string, arg6: number): Promise<[string, string]>
  blpop(): Promise<[string, string]> {
    return this.redisClientProxy('blpop', arguments)
  }

  /**
   * Remove and get the last element in a list, or block until one is available.
   */
  brpop(args: Array<string | number>): Promise<[string, string]>
  brpop(...args: Array<string | number>): Promise<[string, string]>
  brpop(arg1: string, arg2: number | Array<string | number>): Promise<[string, string]>
  brpop(arg1: string, arg2: string, arg3: number): Promise<[string, string]>
  brpop(arg1: string, arg2: string, arg3: string, arg4: number): Promise<[string, string]>
  brpop(arg1: string, arg2: string, arg3: string, arg4: string, arg5: number): Promise<[string, string]>
  brpop(arg1: string, arg2: string, arg3: string, arg4: string, arg5: string, arg6: number): Promise<[string, string]>
  brpop(): Promise<[string, string]> {
    return this.redisClientProxy('brpop', arguments)
  }

  /**
   * Pop a value from a list, push it to another list and return it; or block until one is available.
   */
  brpoplpush(source: string, destination: string, timeout: number): Promise<string | null> {
    return this.redisClientProxy('brpoplpush', arguments)
  }

  /**
   * ADDSLOTS - Assign new hash slots to receiving node.
   * COUNT-FAILURE-REPORTS - Return the number of failure reports active for a given node.
   * COUNTKEYSINSLOT - Return the number of local keys in the specified hash slot.
   * DELSLOTS - Set hash slots as unbound in receiving node.
   * FAILOVER - Forces a slave to perform a manual failover of its master.
   * FORGET - Remove a node from the nodes table.
   * GETKEYSINSLOT - Return local key names in the specified hash slot.
   * INFO - Provides info about Redis Cluster node state.
   * KEYSLOT - Returns the hash slot of the specified key.
   * MEET - Force a node cluster to handshake with another node.
   * NODES - Get cluster config for the node.
   * REPLICATE - Reconfigure a node as a slave of the specified master node.
   * RESET - Reset a Redis Cluster node.
   * SAVECONFIG - Forces the node to save cluster state on disk.
   * SET-CONFIG-EPOCH - Set the configuration epoch in a new node.
   * SETSLOT - Bind a hash slot to a specified node.
   * SLAVES - List slave nodes of the specified master node.
   * SLOTS - Get array of Cluster slot to node mappings.
   */
  cluster(...args: Array<string>): Promise<any> {
    return this.redisClientProxy('cluster', arguments)
  }

  /**
   * Get array of Redis command details.
   *
   * COUNT - Get total number of Redis commands.
   * GETKEYS - Extract keys given a full Redis command.
   * INFO - Get array of specific REdis command details.
   */
  command(): Promise<Array<[string, number, string[], number, number, number]>> {
    return this.redisClientProxy('command', arguments)
  }

  /**
   * Get array of Redis command details.
   *
   * COUNT - Get array of Redis command details.
   * GETKEYS - Extract keys given a full Redis command.
   * INFO - Get array of specific Redis command details.
   * GET - Get the value of a configuration parameter.
   * REWRITE - Rewrite the configuration file with the in memory configuration.
   * SET - Set a configuration parameter to the given value.
   * RESETSTAT - Reset the stats returned by INFO.
   */
  config(...args: Array<string>): Promise<boolean> {
    return this.redisClientProxy('config', arguments)
  }

  /**
   * Return the number of keys in the selected database.
   */
  dbsize(): Promise<number> {
    return this.redisClientProxy('dbsize', arguments)
  }

  /**
   * OBJECT - Get debugging information about a key.
   * SEGFAULT - Make the server crash.
   */
  debug(...args: Array<string>): Promise<boolean> {
    return this.redisClientProxy('debug', arguments)
  }

  /**
   * Decrement the integer value of a key by one.
   */
  decr(key: string): Promise<number> {
    return this.redisClientProxy('decr', arguments)
  }

  /**
   * Decrement the integer value of a key by the given number.
   */
  decrby(key: string, decrement: number): Promise<number> {
    return this.redisClientProxy('decrby', arguments)
  }

  /**
   * Delete a key.
   */
  del(...args: Array<string>): Promise<number> {
    return this.redisClientProxy('del', arguments)
  }

  /**
   * Discard all commands issued after MULTI.
   */
  discard(): Promise<'OK'> {
    return this.redisClientProxy('discard', arguments)
  }

  /**
   * Return a serialized version of the value stored at the specified key.
   */
  dump(key: string): Promise<string> {
    return this.redisClientProxy('dump', arguments)
  }

  /**
   * Echo the given string.
   */
  echo<T extends string>(message: T): Promise<T> {
    return this.redisClientProxy('echo', arguments)
  }

  /**
   * Execute a Lua script server side.
   */
  eval(...args: Array<string | number>): Promise<any> {
    return this.redisClientProxy('eval', arguments)
  }

  /**
   * Execute a Lue script server side.
   */
  evalsha(...args: Array<string | number>): Promise<any> {
    return this.redisClientProxy('evalsha', arguments)
  }

  /**
   * Determine if a key exists.
   */
  exists(...args: Array<string>): Promise<number> {
    return this.redisClientProxy('exists', arguments)
  }

  /**
   * Set a key's time to live in seconds.
   */
  expire(key: string, seconds: number): Promise<number> {
    return this.redisClientProxy('expire', arguments)
  }

  /**
   * Set the expiration for a key as a UNIX timestamp.
   */
  expireat(key: string, timestamp: number): Promise<number> {
    return this.redisClientProxy('expireat', arguments)
  }

  /**
   * Remove all keys from all databases.
   */
  flushall(): Promise<string> {
    return this.redisClientProxy('flushall', arguments)
  }

  /**
   * Remove all keys from the current database.
   */
  flushdb(): Promise<string> {
    return this.redisClientProxy('flushdb', arguments)
  }

  /**
   * Add one or more geospatial items in the geospatial index represented using a sorted set.
   */
  geoadd(): Promise<number>
  geoadd(key: string): Promise<number>
  geoadd(key: string, ...args: Array<string | number>): Promise<number>
  geoadd(): Promise<number> {
    return this.redisClientProxy('geoadd', arguments)
  }

  /**
   * Returns members of a geospatial index as standard geohash strings.
   */
  geohash(): Promise<string>
  geohash(key: string): Promise<string>
  geohash(key: string, ...args: Array<string>): Promise<string>
  geohash(): Promise<string> {
    return this.redisClientProxy('geohash', arguments)
  }

  /**
   * Returns longitude and latitude of members of a geospatial index.
   */
  geopos(): Promise<Array<[number, number]>>
  geopos(key: string): Promise<Array<[number, number]>>
  geopos(key: string, ...args: Array<string>): Promise<Array<[number, number]>>
  geopos(): Promise<Array<[number, number]>> {
    return this.redisClientProxy('geopos', arguments)
  }

  /**
   * Returns the distance between two members of a geospatial index.
   */
  geodist(): Promise<string>
  geodist(key: string): Promise<string>
  geodist(key: string, ...args: Array<string>): Promise<string>
  geodist(): Promise<string> {
    return this.redisClientProxy('geodist', arguments)
  }

  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point.
   */
  georadius(): Promise<Array<string | [string, string | [string, string]]>>
  georadius(key: string): Promise<Array<string | [string, string | [string, string]]>>
  georadius(key: string, ...args: Array<string | number>): Promise<Array<string | [string, string | [string, string]]>>
  georadius(): Promise<Array<string | [string, string | [string, string]]>> {
    return this.redisClientProxy('georadius', arguments)
  }

  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member.
   */
  georadiusbymember(): Promise<Array<string | [string, string | [string, string]]>>
  georadiusbymember(key: string): Promise<Array<string | [string, string | [string, string]]>>
  georadiusbymember(
    key: string,
    ...args: Array<string | number>
  ): Promise<Array<string | [string, string | [string, string]]>>
  georadiusbymember(): Promise<Array<string | [string, string | [string, string]]>> {
    return this.redisClientProxy('georadiusbymember', arguments)
  }

  /**
   * Get the value of a key.
   */
  get(key: string): Promise<string> {
    return this.redisClientProxy('get', arguments)
  }

  /**
   * Returns the bit value at offset in the string value stored at key.
   */
  getbit(key: string, offset: number): Promise<number> {
    return this.redisClientProxy('getbit', arguments)
  }

  /**
   * Get a substring of the string stored at a key.
   */
  getrange(key: string, start: number, end: number): Promise<string> {
    return this.redisClientProxy('getrange', arguments)
  }

  /**
   * Set the string value of a key and return its old value.
   */
  getset(key: string, value: string): Promise<string> {
    return this.redisClientProxy('getset', arguments)
  }

  /**
   * Delete on or more hash fields.
   */
  hdel(): Promise<number>
  hdel(key: string): Promise<number>
  hdel(key: string, ...args: Array<string>): Promise<number>
  hdel(): Promise<number> {
    return this.redisClientProxy('hdel', arguments)
  }

  /**
   * Determine if a hash field exists.
   */
  hexists(key: string, field: string): Promise<number> {
    return this.redisClientProxy('hexists', arguments)
  }

  /**
   * Get the value of a hash field.
   */
  hget(key: string, field: string): Promise<string> {
    return this.redisClientProxy('hget', arguments)
  }

  /**
   * Get all fields and values in a hash.
   */
  hgetall(key: string): Promise<{ [key: string]: string }> {
    return this.redisClientProxy('hgetall', arguments)
  }

  /**
   * Increment the integer value of a hash field by the given number.
   */
  hincrby(key: string, field: string, increment: number): Promise<number> {
    return this.redisClientProxy('hincrby', arguments)
  }

  /**
   * Increment the float value of a hash field by the given amount.
   */
  hincrbyfloat(key: string, field: string, increment: number): Promise<number> {
    return this.redisClientProxy('hincrbyfloat', arguments)
  }

  /**
   * Get all the fields of a hash.
   */
  hkeys(key: string): Promise<string[]> {
    return this.redisClientProxy('hkeys', arguments)
  }

  /**
   * Get the number of fields in a hash.
   */
  hlen(key: string): Promise<number> {
    return this.redisClientProxy('hlen', arguments)
  }

  /**
   * Get the values of all the given hash fields.
   */
  hmget(): Promise<string[]>
  hmget(key: string): Promise<string[]>
  hmget(key: string, ...args: Array<string>): Promise<string[]>
  hmget(): Promise<string[]> {
    return this.redisClientProxy('hmget', arguments)
  }

  /**
   * Set the string value of a hash field.
   */
  hset(key: string, field: string, value: string): Promise<number> {
    return this.redisClientProxy('hset', arguments)
  }

  /**
   * Set the value of a hash field, only if the field does not exist.
   */
  hsetnx(key: string, field: string, value: string): Promise<number> {
    return this.redisClientProxy('hsetnx', arguments)
  }

  /**
   * Get the length of the value of a hash field.
   */
  hstrlen(key: string, field: string): Promise<number> {
    return this.redisClientProxy('hstrlen', arguments)
  }

  /**
   * Get all the values of a hash.
   */
  hvals(key: string): Promise<string[]> {
    return this.redisClientProxy('hvals', arguments)
  }

  /**
   * Increment the integer value of a key by one.
   */
  incr(key: string): Promise<number> {
    return this.redisClientProxy('incr', arguments)
  }

  /**
   * Increment the integer value of a key by the given amount.
   */
  incrby(key: string, increment: number): Promise<number> {
    return this.redisClientProxy('incrby', arguments)
  }

  /**
   * Increment the float value of a key by the given amount.
   */
  incrbyfloat(key: string, increment: number): Promise<number> {
    return this.redisClientProxy('incrbyfloat', arguments)
  }

  /**
   * Find all keys matching the given pattern.
   */
  keys(pattern: string): Promise<string[]> {
    return this.redisClientProxy('keys', arguments)
  }

  /**
   * Get the UNIX time stamp of the last successful save to disk.
   */
  lastsave(): Promise<number> {
    return this.redisClientProxy('lastsave', arguments)
  }

  /**
   * Get an element from a list by its index.
   */
  lindex(key: string, index: number): Promise<string> {
    return this.redisClientProxy('lindex', arguments)
  }

  /**
   * Insert an element before or after another element in a list.
   */
  linsert(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Promise<string> {
    return this.redisClientProxy('linsert', arguments)
  }

  /**
   * Get the length of a list.
   */
  llen(key: string): Promise<number> {
    return this.redisClientProxy('llen', arguments)
  }

  /**
   * Remove and get the first element in a list.
   */
  lpop(key: string): Promise<string> {
    return this.redisClientProxy('lpop', arguments)
  }

  /**
   * Prepend one or multiple values to a list.
   */
  lpush(): Promise<number>
  lpush(key: string): Promise<number>
  lpush(key: string, ...args: Array<string>): Promise<number>
  lpush(): Promise<number> {
    return this.redisClientProxy('lpush', arguments)
  }

  /**
   * Prepend a value to a list, only if the list exists.
   */
  lpushx(key: string, value: string): Promise<number> {
    return this.redisClientProxy('lpushx', arguments)
  }

  /**
   * Get a range of elements from a list.
   */
  lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClientProxy('lrange', arguments)
  }

  /**
   * Remove elements from a list.
   */
  lrem(key: string, count: number, value: string): Promise<number> {
    return this.redisClientProxy('lrem', arguments)
  }

  /**
   * Set the value of an element in a list by its index.
   */
  lset(key: string, index: number, value: string): Promise<'OK'> {
    return this.redisClientProxy('lset', arguments)
  }

  /**
   * Trim a list to the specified range.
   */
  ltrim(key: string, start: number, stop: number): Promise<'OK'> {
    return this.redisClientProxy('ltrim', arguments)
  }

  /**
   * Get the values of all given keys.
   */
  mget(...args: Array<string>): Promise<string[]> {
    return this.redisClientProxy('mget', arguments)
  }

  /**
   * Atomically transfer a key from a Redis instance to another one.
   */
  migrate(...args: Array<string>): Promise<boolean> {
    return this.redisClientProxy('migrate', arguments)
  }

  /**
   * Move a key to another database.
   */
  move(key: string, db: string | number): Promise<void> {
    return this.redisClientProxy('move', arguments)
  }

  /**
   * Set multiple keys to multiple values.
   */
  mset(...args: Array<string>): Promise<boolean> {
    return this.redisClientProxy('mset', arguments)
  }

  /**
   * Set multiple keys to multiple values, only if none of the keys exist.
   */
  msetnx(...args: Array<string>): Promise<boolean> {
    return this.redisClientProxy('msetnx', arguments)
  }

  /**
   * Inspect the internals of Redis objects.
   */
  object(...args: Array<string>): Promise<any> {
    return this.redisClientProxy('object', arguments)
  }

  /**
   * Remove the expiration from a key.
   */
  persist(key: string): Promise<number> {
    return this.redisClientProxy('persist', arguments)
  }

  /**
   * Remove a key's time to live in milliseconds.
   */
  pexpire(key: string, milliseconds: number): Promise<number> {
    return this.redisClientProxy('pexpire', arguments)
  }

  /**
   * Set the expiration for a key as a UNIX timestamp specified in milliseconds.
   */
  pexpireat(key: string, millisecondsTimestamp: number): Promise<number> {
    return this.redisClientProxy('pexpireat', arguments)
  }

  /**
   * Adds the specified elements to the specified HyperLogLog.
   */
  pfadd(): Promise<number>
  pfadd(key: string): Promise<number>
  pfadd(key: string, ...args: Array<string>): Promise<number>
  pfadd(): Promise<number> {
    return this.redisClientProxy('pfadd', arguments)
  }

  /**
   * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
   */
  pfcount(...args: Array<string>): Promise<number> {
    return this.redisClientProxy('pfcount', arguments)
  }

  /**
   * Merge N different HyperLogLogs into a single one.
   */
  pfmerge(...args: Array<string>): Promise<boolean> {
    return this.redisClientProxy('pfmerge', arguments)
  }

  /**
   * Set the value and expiration in milliseconds of a key.
   */
  psetex(key: string, milliseconds: number, value: string): Promise<'OK'> {
    return this.redisClientProxy('psetex', arguments)
  }

  /**
   * Inspect the state of the Pub/Sub subsystem.
   */
  pubsub(...args: Array<string>): Promise<number> {
    return this.redisClientProxy('pubsub', arguments)
  }

  /**
   * Get the time to live for a key in milliseconds.
   */
  pttl(key: string): Promise<number> {
    return this.redisClientProxy('pttl', arguments)
  }

  /**
   * Close the connection.
   */
  quit(): Promise<'OK'> {
    return this.redisClientProxy('quit', arguments)
  }

  /**
   * Return a random key from the keyspace.
   */
  randomkey(): Promise<string> {
    return this.redisClientProxy('randomkey', arguments)
  }

  /**
   * Enables read queries for a connection to a cluster slave node.
   */
  readonly(): Promise<string> {
    return this.redisClientProxy('readonly', arguments)
  }

  /**
   * Disables read queries for a connection to cluster slave node.
   */
  readwrite(): Promise<string> {
    return this.redisClientProxy('readwrite', arguments)
  }

  /**
   * Rename a key.
   */
  rename(key: string, newKey: string): Promise<'OK'> {
    return this.redisClientProxy('rename', arguments)
  }

  /**
   * Rename a key, only if the new key does not exist.
   */
  renamenx(key: string, newKey: string): Promise<number> {
    return this.redisClientProxy('renamenx', arguments)
  }

  /**
   * Create a key using the provided serialized value, previously obtained using DUMP.
   */
  restore(key: string, ttl: number, serializedValue: string): Promise<'OK'> {
    return this.redisClientProxy('restore', arguments)
  }

  /**
   * Return the role of the instance in the context of replication.
   */
  role(): Promise<[string, number, Array<[string, string, string]>]> {
    return this.redisClientProxy('role', arguments)
  }

  /**
   * Remove and get the last element in a list.
   */
  rpop(key: string): Promise<string> {
    return this.redisClientProxy('rpop', arguments)
  }

  /**
   * Remove the last element in a list, prepend it to another list and return it.
   */
  rpoplpush(source: string, destination: string): Promise<string> {
    return this.redisClientProxy('rpoplpush', arguments)
  }

  /**
   * Append one or multiple values to a list.
   */
  rpush(): Promise<number>
  rpush(key: string): Promise<number>
  rpush(key: string, ...args: Array<string>): Promise<number>
  rpush(): Promise<number> {
    return this.redisClientProxy('rpush', arguments)
  }

  /**
   * Append a value to a list, only if the list exists.
   */
  rpushx(key: string, value: string): Promise<number> {
    return this.redisClientProxy('rpushx', arguments)
  }

  /**
   * Append one or multiple members to a set.
   */
  sadd(): Promise<number>
  sadd(key: string): Promise<number>
  sadd(key: string, ...args: Array<string>): Promise<number>
  sadd(): Promise<number> {
    return this.redisClientProxy('sadd', arguments)
  }

  /**
   * Synchronously save the dataset to disk.
   */
  save(): Promise<string> {
    return this.redisClientProxy('save', arguments)
  }

  /**
   * Get the number of members in a set.
   */
  scard(key: string): Promise<number> {
    return this.redisClientProxy('scard', arguments)
  }

  /**
   * DEBUG - Set the debug mode for executed scripts.
   * EXISTS - Check existence of scripts in the script cache.
   * FLUSH - Remove all scripts from the script cache.
   * KILL - Kill the script currently in execution.
   * LOAD - Load the specified Lua script into the script cache.
   */
  script(...args: Array<string>): Promise<any> {
    return this.redisClientProxy('script', arguments)
  }

  /**
   * Subtract multiple sets.
   */
  sdiff(...args: Array<string>): Promise<string[]> {
    return this.redisClientProxy('sdiff', arguments)
  }

  /**
   * Subtract multiple sets and store the resulting set in a key.
   */
  sdiffstore(): Promise<number>
  sdiffstore(key: string): Promise<number>
  sdiffstore(key: string, ...args: Array<string>): Promise<number>
  sdiffstore(): Promise<number> {
    return this.redisClientProxy('sdiffstore', arguments)
  }

  /**
   * Change the selected database for the current connection.
   */
  select(index: number | string): Promise<string> {
    return this.redisClientProxy('select', arguments)
  }

  /**
   * Set the string value of a key.
   */
  set(key: string, value: string): Promise<'OK'>
  set(key: string, value: string, flag: string): Promise<'OK'>
  set(key: string, value: string, mode: string, duration: number): Promise<'OK' | undefined>
  set(key: string, value: string, mode: string, duration: number, flag: string): Promise<'OK' | undefined>
  set(): Promise<any> {
    return this.redisClientProxy('set', arguments)
  }

  /**
   * Sets or clears the bit at offset in the string value stored at key.
   */
  setbit(key: string, offset: number, value: string): Promise<number> {
    return this.redisClientProxy('setbit', arguments)
  }

  /**
   * Set the value and expiration of a key.
   */
  setex(key: string, seconds: number, value: string): Promise<string> {
    return this.redisClientProxy('setex', arguments)
  }

  /**
   * Set the value of a key, only if the key does not exist.
   */
  setnx(key: string, value: string): Promise<number> {
    return this.redisClientProxy('setnx', arguments)
  }

  /**
   * Overwrite part of a string at key starting at the specified offset.
   */
  setrange(key: string, offset: number, value: string): Promise<number> {
    return this.redisClientProxy('setrange', arguments)
  }

  /**
   * Synchronously save the dataset to disk and then shut down the server.
   */
  shutdown(...args: Array<string>): Promise<string> {
    return this.redisClientProxy('shutdown', arguments)
  }

  /**
   * Intersect multiple sets.
   */
  sinter(): Promise<string[]>
  sinter(key: string): Promise<string[]>
  sinter(key: string, ...args: Array<string>): Promise<string[]>
  sinter(): Promise<string[]> {
    return this.redisClientProxy('sinter', arguments)
  }

  /**
   * Intersect multiple sets and store the resulting set in a key.
   */
  sinterstore(...args: Array<string>): Promise<number> {
    return this.redisClientProxy('sinterstore', arguments)
  }

  /**
   * Determine if a given value is a member of a set.
   */
  sismember(key: string, member: string): Promise<number> {
    return this.redisClientProxy('sismember', arguments)
  }

  /**
   * Make the server a slave of another instance, or promote it as master.
   */
  slaveof(host: string, port: string | number): Promise<string> {
    return this.redisClientProxy('slaveof', arguments)
  }

  /**
   * Manages the Redis slow queries log.
   */
  slowlog(...args: Array<string>): Promise<Array<[number, number, number, string[]]>> {
    return this.redisClientProxy('slowlog', arguments)
  }

  /**
   * Get all the members in a set.
   */
  smembers(key: string): Promise<string[]> {
    return this.redisClientProxy('smembers', arguments)
  }

  /**
   * Move a member from one set to another.
   */
  smove(source: string, destination: string, member: string): Promise<number> {
    return this.redisClientProxy('smove', arguments)
  }

  /**
   * Sort the elements in a list, set or sorted set.
   */
  sort(...args: Array<string>): Promise<string[]> {
    return this.redisClientProxy('sort', arguments)
  }

  /**
   * Remove and return one or multiple random members from a set.
   */
  spop(key: string): Promise<string>
  spop(key: string, count: number): Promise<string[]>
  spop(): Promise<any> {
    return this.redisClientProxy('spop', arguments)
  }

  /**
   * Get one or multiple random members from a set.
   */
  srandmember(key: string): Promise<string>
  srandmember(key: string, count: number): Promise<string[]>
  srandmember(): Promise<any> {
    return this.redisClientProxy('srandmember', arguments)
  }

  /**
   * Remove one or more members from a set.
   */
  srem(): Promise<number>
  srem(key: string): Promise<number>
  srem(key: string, ...args: Array<string>): Promise<number>
  srem(): Promise<number> {
    return this.redisClientProxy('srem', arguments)
  }

  /**
   * Get the length of the value stored in a key.
   */
  strlen(key: string): Promise<number> {
    return this.redisClientProxy('strlen', arguments)
  }

  /**
   * Add multiple sets.
   */
  sunion(...args: Array<string>): Promise<string[]> {
    return this.redisClientProxy('sunion', arguments)
  }

  /**
   * Add multiple sets and store the resulting set in a key.
   */
  sunionstore(...args: Array<string>): Promise<number> {
    return this.redisClientProxy('sunionstore', arguments)
  }

  /**
   * Internal command used for replication.
   */
  sync(): Promise<undefined> {
    return this.redisClientProxy('sync', arguments)
  }

  /**
   * Return the current server time.
   */
  time(): Promise<[string, string]> {
    return this.redisClientProxy('time', arguments)
  }

  /**
   * Get the time to live for a key.
   */
  ttl(key: string): Promise<number> {
    return this.redisClientProxy('ttl', arguments)
  }

  /**
   * Determine the type stored at key.
   */
  type(key: string): Promise<string> {
    return this.redisClientProxy('type', arguments)
  }

  /**
   * Forget about all watched keys.
   */
  unwatch(): Promise<'OK'> {
    return this.redisClientProxy('unwatch', arguments)
  }

  /**
   * Wait for the synchronous replication of all the write commands sent in the context of the current connection.
   */
  wait(numSlaves: number, timeout: number): Promise<number> {
    return this.redisClientProxy('wait', arguments)
  }

  /**
   * Watch the given keys to determine execution of the MULTI/EXEC block.
   */
  watch(...args: Array<string>): Promise<'OK'> {
    return this.redisClientProxy('watch', arguments)
  }

  /**
   * Add one or more members to a sorted set, or update its score if it already exists.
   */
  zadd(): Promise<number>
  zadd(key: string): Promise<number>
  zadd(key: string, ...args: Array<string | number>): Promise<number>
  zadd(): Promise<number> {
    return this.redisClientProxy('zadd', arguments)
  }

  /**
   * Get the number of members in a sorted set.
   */
  zcard(key: string): Promise<number> {
    return this.redisClientProxy('zcard', arguments)
  }

  /**
   * Count the members in a sorted set with scores between the given values.
   */
  zcount(key: string, min: number | string, max: number | string): Promise<number> {
    return this.redisClientProxy('zcount', arguments)
  }

  /**
   * Increment the score of a member in a sorted set.
   */
  zincrby(key: string, increment: number, member: string): Promise<number> {
    return this.redisClientProxy('zincrby', arguments)
  }

  /**
   * Intersect multiple sorted sets and store the resulting sorted set in a new key.
   */
  zinterstore(...args: Array<string | number>): Promise<number> {
    return this.redisClientProxy('zinterstore', arguments)
  }

  /**
   * Count the number of members in a sorted set between a given lexicographic range.
   */
  zlexcount(key: string, min: string, max: string): Promise<number> {
    return this.redisClientProxy('zlexcount', arguments)
  }

  /**
   * Return a range of members in a sorted set, by index.
   */
  zrange(key: string, start: number, stop: number): Promise<string[]>
  zrange(key: string, start: number, stop: number, withScores: string): Promise<string[]>
  zrange(): Promise<string[]> {
    return this.redisClientProxy('zrange', arguments)
  }

  /**
   * Return a range of members in a sorted set, by lexicographical range.
   */
  zrangebylex(key: string, min: string, max: string): Promise<string[]>
  zrangebylex(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>
  zrangebylex(): Promise<string[]> {
    return this.redisClientProxy('zrangebylex', arguments)
  }

  /**
   * Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
   */
  zrevrangebylex(key: string, min: string, max: string): Promise<string[]>
  zrevrangebylex(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>
  zrevrangebylex(): Promise<string[]> {
    return this.redisClientProxy('zrevrangebylex', arguments)
  }

  /**
   * Return a range of members in a sorted set, by score.
   */
  zrangebyscore(key: string, min: number | string, max: number | string): Promise<string[]>
  zrangebyscore(key: string, min: number | string, max: number | string, withScores: string): Promise<string[]>
  zrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
    limit: string,
    offset: number,
    count: number
  ): Promise<string[]>
  zrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
    withScores: string,
    limit: string,
    offset: number,
    count: number
  ): Promise<string[]>
  zrangebyscore() {
    return this.redisClientProxy('zrangebyscore', arguments)
  }

  /**
   * Determine the index of a member in a sorted set.
   */
  zrank(key: string, member: string): Promise<number | undefined> {
    return this.redisClientProxy('zrank', arguments)
  }

  /**
   * Remove one or more members from a sorted set.
   */
  zrem(): Promise<number>
  zrem(key: string): Promise<number>
  zrem(key: string, ...args: Array<string>): Promise<number>
  zrem(): Promise<number> {
    return this.redisClientProxy('zrem', arguments)
  }

  /**
   * Remove all members in a sorted set between the given lexicographical range.
   */
  zremrangebylex(key: string, min: string, max: string): Promise<number> {
    return this.redisClientProxy('zremrangebylex', arguments)
  }

  /**
   * Remove all members in a sorted set within the given indexes.
   */
  zremrangebyrank(key: string, start: number, stop: number): Promise<number> {
    return this.redisClientProxy('zremrangebyrank', arguments)
  }

  /**
   * Remove all members in a sorted set within the given indexes.
   */
  zremrangebyscore(key: string, min: string | number, max: string | number): Promise<number> {
    return this.redisClientProxy('zremrangebyscore', arguments)
  }

  /**
   * Return a range of members in a sorted set, by index, with scores ordered from high to low.
   */
  zrevrange(key: string, start: number, stop: number): Promise<string[]>
  zrevrange(key: string, start: number, stop: number, withScores: string): Promise<string[]>
  zrevrange(): Promise<string[]> {
    return this.redisClientProxy('zrevrange', arguments)
  }

  /**
   * Return a range of members in a sorted set, by score, with scores ordered from high to low.
   */
  zrevrangebyscore(key: string, min: number | string, max: number | string): Promise<string[]>
  zrevrangebyscore(key: string, min: number | string, max: number | string, withScores: string): Promise<string[]>
  zrevrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
    limit: string,
    offset: number,
    count: number
  ): Promise<string[]>
  zrevrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
    withScores: string,
    limit: string,
    offset: number,
    count: number
  ): Promise<string[]>
  zrevrangebyscore() {
    return this.redisClientProxy('zrevrangebyscore', arguments)
  }

  /**
   * Determine the index of a member in a sorted set, with scores ordered from high to low.
   */
  zrevrank(key: string, member: string): Promise<number | undefined> {
    return this.redisClientProxy('zrevrank', arguments)
  }

  /**
   * Get the score associated with the given member in a sorted set.
   */
  zscore(key: string, member: string): Promise<string> {
    return this.redisClientProxy('zscore', arguments)
  }

  /**
   * Add multiple sorted sets and store the resulting sorted set in a new key.
   */
  zunionstore(...args: Array<string | number>): Promise<number> {
    return this.redisClientProxy('zunionstore', arguments)
  }

  /**
   * Incrementally iterate the keys space.
   */
  scan(...args: Array<string>): Promise<[string, string[]]> {
    return this.redisClientProxy('scan', arguments)
  }

  /**
   * Incrementally iterate Set elements.
   */
  sscan(): Promise<[string, string[]]>
  sscan(key: string): Promise<[string, string[]]>
  sscan(key: string, ...args: Array<string>): Promise<[string, string[]]>
  sscan(): Promise<[string, string[]]> {
    return this.redisClientProxy('sscan', arguments)
  }

  /**
   * Incrementally iterate hash fields and associated values.
   */
  hscan(): Promise<[string, string[]]>
  hscan(key: string): Promise<[string, string[]]>
  hscan(key: string, ...args: Array<string>): Promise<[string, string[]]>
  hscan(): Promise<[string, string[]]> {
    return this.redisClientProxy('hscan', arguments)
  }

  /**
   * Incrementally iterate sorted sets elements and associated scores.
   */
  zscan(): Promise<[string, string[]]>
  zscan(key: string): Promise<[string, string[]]>
  zscan(key: string, ...args: Array<string>): Promise<[string, string[]]>
  zscan(): Promise<[string, string[]]> {
    return this.redisClientProxy('zscan', arguments)
  }
}
register(RedisClient)
