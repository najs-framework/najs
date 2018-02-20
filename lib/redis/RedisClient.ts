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
  bitfield(key: string, arg: Array<string | number>): Promise<[number, number]>
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

  // /**
  //  * Remove and get the first element in a list, or block until one is available.
  //  */
  // blpop: OverloadedLastCommand<string, number, [string, string], R>
  // BLPOP: OverloadedLastCommand<string, number, [string, string], R>

  // /**
  //  * Remove and get the last element in a list, or block until one is available.
  //  */
  // brpop: OverloadedLastCommand<string, number, [string, string], R>
  // BRPOP: OverloadedLastCommand<string, number, [string, string], R>

  /**
   * Pop a value from a list, push it to another list and return it; or block until one is available.
   */
  brpoplpush(source: string, destination: string, timeout: number): Promise<string | null> {
    return this.redisClientProxy('brpoplpush', arguments)
  }

  // /**
  //  * ADDSLOTS - Assign new hash slots to receiving node.
  //  * COUNT-FAILURE-REPORTS - Return the number of failure reports active for a given node.
  //  * COUNTKEYSINSLOT - Return the number of local keys in the specified hash slot.
  //  * DELSLOTS - Set hash slots as unbound in receiving node.
  //  * FAILOVER - Forces a slave to perform a manual failover of its master.
  //  * FORGET - Remove a node from the nodes table.
  //  * GETKEYSINSLOT - Return local key names in the specified hash slot.
  //  * INFO - Provides info about Redis Cluster node state.
  //  * KEYSLOT - Returns the hash slot of the specified key.
  //  * MEET - Force a node cluster to handshake with another node.
  //  * NODES - Get cluster config for the node.
  //  * REPLICATE - Reconfigure a node as a slave of the specified master node.
  //  * RESET - Reset a Redis Cluster node.
  //  * SAVECONFIG - Forces the node to save cluster state on disk.
  //  * SET-CONFIG-EPOCH - Set the configuration epoch in a new node.
  //  * SETSLOT - Bind a hash slot to a specified node.
  //  * SLAVES - List slave nodes of the specified master node.
  //  * SLOTS - Get array of Cluster slot to node mappings.
  //  */
  // cluster: OverloadedCommand<string, any, this>
  // CLUSTER: OverloadedCommand<string, any, this>

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

  // /**
  //  * Get array of Redis command details.
  //  *
  //  * COUNT - Get array of Redis command details.
  //  * GETKEYS - Extract keys given a full Redis command.
  //  * INFO - Get array of specific Redis command details.
  //  * GET - Get the value of a configuration parameter.
  //  * REWRITE - Rewrite the configuration file with the in memory configuration.
  //  * SET - Set a configuration parameter to the given value.
  //  * RESETSTAT - Reset the stats returned by INFO.
  //  */
  // config: OverloadedCommand<string, boolean, R>
  // CONFIG: OverloadedCommand<string, boolean, R>

  /**
   * Return the number of keys in the selected database.
   */
  dbsize(): Promise<number> {
    return this.redisClientProxy('dbsize', arguments)
  }

  // /**
  //  * OBJECT - Get debugging information about a key.
  //  * SEGFAULT - Make the server crash.
  //  */
  // debug: OverloadedCommand<string, boolean, R>
  // DEBUG: OverloadedCommand<string, boolean, R>

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

  // /**
  //  * Delete a key.
  //  */
  // del: OverloadedCommand<string, number, R>
  // DEL: OverloadedCommand<string, number, R>

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

  // /**
  //  * Execute a Lua script server side.
  //  */
  // eval: OverloadedCommand<string | number, any, R>
  // EVAL: OverloadedCommand<string | number, any, R>

  // /**
  //  * Execute a Lue script server side.
  //  */
  // evalsha: OverloadedCommand<string | number, any, R>
  // EVALSHA: OverloadedCommand<string | number, any, R>

  // /**
  //  * Determine if a key exists.
  //  */
  // exists: OverloadedCommand<string, number, R>
  // EXISTS: OverloadedCommand<string, number, R>

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

  // /**
  //  * Add one or more geospatial items in the geospatial index represented using a sorted set.
  //  */
  // geoadd: OverloadedKeyCommand<string | number, number, R>
  // GEOADD: OverloadedKeyCommand<string | number, number, R>

  // /**
  //  * Returns members of a geospatial index as standard geohash strings.
  //  */
  // geohash: OverloadedKeyCommand<string, string, R>
  // GEOHASH: OverloadedKeyCommand<string, string, R>

  // /**
  //  * Returns longitude and latitude of members of a geospatial index.
  //  */
  // geopos: OverloadedKeyCommand<string, Array<[number, number]>, R>
  // GEOPOS: OverloadedKeyCommand<string, Array<[number, number]>, R>

  // /**
  //  * Returns the distance between two members of a geospatial index.
  //  */
  // geodist: OverloadedKeyCommand<string, string, R>
  // GEODIST: OverloadedKeyCommand<string, string, R>

  // /**
  //  * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point.
  //  */
  // georadius: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>
  // GEORADIUS: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>

  // /**
  //  * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member.
  //  */
  // georadiusbymember: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>
  // GEORADIUSBYMEMBER: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>

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

  // /**
  //  * Delete on or more hash fields.
  //  */
  // hdel: OverloadedKeyCommand<string, number, R>
  // HDEL: OverloadedKeyCommand<string, number, R>

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

  // /**
  //  * Get the values of all the given hash fields.
  //  */
  // hmget: OverloadedKeyCommand<string, string[], R>
  // HMGET: OverloadedKeyCommand<string, string[], R>

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

  // /**
  //  * Prepend one or multiple values to a list.
  //  */
  // lpush: OverloadedKeyCommand<string, number, R>

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

  // /**
  //  * Get the values of all given keys.
  //  */
  // mget: OverloadedCommand<string, string[], R>
  // MGET: OverloadedCommand<string, string[], R>

  // /**
  //  * Atomically transfer a key from a Redis instance to another one.
  //  */
  // migrate: OverloadedCommand<string, boolean, R>
  // MIGRATE: OverloadedCommand<string, boolean, R>

  /**
   * Move a key to another database.
   */
  move(key: string, db: string | number): Promise<void> {
    return this.redisClientProxy('move', arguments)
  }

  // /**
  //  * Set multiple keys to multiple values.
  //  */
  // mset: OverloadedCommand<string, boolean, R>
  // MSET: OverloadedCommand<string, boolean, R>

  // /**
  //  * Set multiple keys to multiple values, only if none of the keys exist.
  //  */
  // msetnx: OverloadedCommand<string, boolean, R>
  // MSETNX: OverloadedCommand<string, boolean, R>

  // /**
  //  * Inspect the internals of Redis objects.
  //  */
  // object: OverloadedCommand<string, any, R>
  // OBJECT: OverloadedCommand<string, any, R>

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

  // /**
  //  * Adds the specified elements to the specified HyperLogLog.
  //  */
  // pfadd: OverloadedKeyCommand<string, number, R>
  // PFADD: OverloadedKeyCommand<string, number, R>

  // /**
  //  * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
  //  */
  // pfcount: OverloadedCommand<string, number, R>
  // PFCOUNT: OverloadedCommand<string, number, R>

  // /**
  //  * Merge N different HyperLogLogs into a single one.
  //  */
  // pfmerge: OverloadedCommand<string, boolean, R>
  // PFMERGE: OverloadedCommand<string, boolean, R>

  /**
   * Set the value and expiration in milliseconds of a key.
   */
  psetex(key: string, milliseconds: number, value: string): Promise<'OK'> {
    return this.redisClientProxy('psetex', arguments)
  }

  // /**
  //  * Inspect the state of the Pub/Sub subsytem.
  //  */
  // pubsub: OverloadedCommand<string, number, R>
  // PUBSUB: OverloadedCommand<string, number, R>

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

  // /**
  //  * Append one or multiple values to a list.
  //  */
  // rpush: OverloadedKeyCommand<string, number, R>
  // RPUSH: OverloadedKeyCommand<string, number, R>

  /**
   * Append a value to a list, only if the list exists.
   */
  rpushx(key: string, value: string): Promise<number> {
    return this.redisClientProxy('rpushx', arguments)
  }

  // /**
  //  * Append one or multiple members to a set.
  //  */
  // sadd: OverloadedKeyCommand<string, number, R>
  // SADD: OverloadedKeyCommand<string, number, R>

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

  // /**
  //  * DEBUG - Set the debug mode for executed scripts.
  //  * EXISTS - Check existence of scripts in the script cache.
  //  * FLUSH - Remove all scripts from the script cache.
  //  * KILL - Kill the script currently in execution.
  //  * LOAD - Load the specified Lua script into the script cache.
  //  */
  // script: OverloadedCommand<string, any, R>
  // SCRIPT: OverloadedCommand<string, any, R>

  // /**
  //  * Subtract multiple sets.
  //  */
  // sdiff: OverloadedCommand<string, string[], R>
  // SDIFF: OverloadedCommand<string, string[], R>

  // /**
  //  * Subtract multiple sets and store the resulting set in a key.
  //  */
  // sdiffstore: OverloadedKeyCommand<string, number, R>
  // SDIFFSTORE: OverloadedKeyCommand<string, number, R>

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

  // /**
  //  * Synchronously save the dataset to disk and then shut down the server.
  //  */
  // shutdown: OverloadedCommand<string, string, R>
  // SHUTDOWN: OverloadedCommand<string, string, R>

  // /**
  //  * Intersect multiple sets.
  //  */
  // sinter: OverloadedKeyCommand<string, string[], R>
  // SINTER: OverloadedKeyCommand<string, string[], R>

  // /**
  //  * Intersect multiple sets and store the resulting set in a key.
  //  */
  // sinterstore: OverloadedCommand<string, number, R>
  // SINTERSTORE: OverloadedCommand<string, number, R>

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

  // /**
  //  * Manages the Redis slow queries log.
  //  */
  // slowlog: OverloadedCommand<string, Array<[number, number, number, string[]]>, R>
  // SLOWLOG: OverloadedCommand<string, Array<[number, number, number, string[]]>, R>

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

  // /**
  //  * Sort the elements in a list, set or sorted set.
  //  */
  // sort: OverloadedCommand<string, string[], R>
  // SORT: OverloadedCommand<string, string[], R>

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

  // /**
  //  * Remove one or more members from a set.
  //  */
  // srem: OverloadedKeyCommand<string, number, R>
  // SREM: OverloadedKeyCommand<string, number, R>

  /**
   * Get the length of the value stored in a key.
   */
  strlen(key: string): Promise<number> {
    return this.redisClientProxy('strlen', arguments)
  }

  // /**
  //  * Add multiple sets.
  //  */
  // sunion: OverloadedCommand<string, string[], R>
  // SUNION: OverloadedCommand<string, string[], R>

  // /**
  //  * Add multiple sets and store the resulting set in a key.
  //  */
  // sunionstore: OverloadedCommand<string, number, R>
  // SUNIONSTORE: OverloadedCommand<string, number, R>

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

  // /**
  //  * Watch the given keys to determine execution of the MULTI/EXEC block.
  //  */
  // watch: OverloadedCommand<string, 'OK', R>
  // WATCH: OverloadedCommand<string, 'OK', R>
}
register(RedisClient)
