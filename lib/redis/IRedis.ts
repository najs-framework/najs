import * as Redis from 'redis'

export interface IRedis {
  /**
   * Create new redis client with a name and use it as current client
   * @param name {string} name of redis client
   * @param options {Object} redis.createClient options
   */
  createClient(name: string, options: Redis.ClientOpts): Redis.RedisClient

  /**
   * Get native redis client
   * @param name {string} name of redis client
   */
  getClient(name: string): Redis.RedisClient

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
  // -------------------------------------------------------------------------------------------------------------------

  /**
   * Append a value to a key.
   */
  append(key: string, value: string): Promise<number>

  /**
   * Authenticate to the server.
   */
  auth(password: string): Promise<string>

  /**
   * Asynchronously rewrite the append-only file.
   */
  bgrewriteaof(): Promise<'OK'>

  /**
   * Asynchronously save the dataset to disk.
   */
  bgsave(): Promise<string>

  /**
   * Count set bits in a string.
   */
  bitcount(key: string): Promise<number>
  bitcount(key: string, start: number, end: number): Promise<number>

  /**
   * Perform arbitrary bitfield integer operations on strings.
   */
  bitfield(key: string, arg: Array<string | number>): Promise<[number, number]>
  bitfield(key: string, ...args: Array<string | number>): Promise<[number, number]>

  /**
   * Perform bitwise operations between strings.
   */
  bitop(operation: string, destKey: string, args: string[]): Promise<number>

  /**
   * Find first bit set or clear in a string.
   */
  bitpos(key: string, bit: number): Promise<number>
  bitpos(key: string, bit: number, start: number): Promise<number>
  bitpos(key: string, bit: number, start: number, end: number): Promise<number>

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
  brpoplpush(source: string, destination: string, timeout: number): Promise<string | null>

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
  command(): Promise<Array<[string, number, string[], number, number, number]>>

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
  dbsize(): Promise<number>

  // /**
  //  * OBJECT - Get debugging information about a key.
  //  * SEGFAULT - Make the server crash.
  //  */
  // debug: OverloadedCommand<string, boolean, R>
  // DEBUG: OverloadedCommand<string, boolean, R>

  /**
   * Decrement the integer value of a key by one.
   */
  decr(key: string): Promise<number>

  /**
   * Decrement the integer value of a key by the given number.
   */
  decrby(key: string, decrement: number): Promise<number>

  // /**
  //  * Delete a key.
  //  */
  // del: OverloadedCommand<string, number, R>
  // DEL: OverloadedCommand<string, number, R>

  /**
   * Discard all commands issued after MULTI.
   */
  discard(): Promise<'OK'>

  /**
   * Return a serialized version of the value stored at the specified key.
   */
  dump(key: string): Promise<string>

  /**
   * Echo the given string.
   */
  echo<T extends string>(message: T): Promise<T>

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
  expire(key: string, seconds: number): Promise<number>

  /**
   * Set the expiration for a key as a UNIX timestamp.
   */
  expireat(key: string, timestamp: number): Promise<number>

  /**
   * Remove all keys from all databases.
   */
  flushall(): Promise<string>

  /**
   * Remove all keys from the current database.
   */
  flushdb(): Promise<string>

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
  get(key: string): Promise<string>

  /**
   * Returns the bit value at offset in the string value stored at key.
   */
  getbit(key: string, offset: number): Promise<number>

  /**
   * Get a substring of the string stored at a key.
   */
  getrange(key: string, start: number, end: number): Promise<string>

  /**
   * Set the string value of a key and return its old value.
   */
  getset(key: string, value: string): Promise<string>

  // /**
  //  * Delete on or more hash fields.
  //  */
  // hdel: OverloadedKeyCommand<string, number, R>
  // HDEL: OverloadedKeyCommand<string, number, R>

  /**
   * Determine if a hash field exists.
   */
  hexists(key: string, field: string): Promise<number>

  /**
   * Get the value of a hash field.
   */
  hget(key: string, field: string): Promise<string>

  /**
   * Get all fields and values in a hash.
   */
  hgetall(key: string): Promise<{ [key: string]: string }>

  /**
   * Increment the integer value of a hash field by the given number.
   */
  hincrby(key: string, field: string, increment: number): Promise<number>

  /**
   * Increment the float value of a hash field by the given amount.
   */
  hincrbyfloat(key: string, field: string, increment: number): Promise<number>

  /**
   * Get all the fields of a hash.
   */
  hkeys(key: string): Promise<string[]>

  /**
   * Get the number of fields in a hash.
   */
  hlen(key: string): Promise<number>

  // /**
  //  * Get the values of all the given hash fields.
  //  */
  // hmget: OverloadedKeyCommand<string, string[], R>
  // HMGET: OverloadedKeyCommand<string, string[], R>

  /**
   * Set the string value of a hash field.
   */
  hset(key: string, field: string, value: string): Promise<number>

  /**
   * Set the value of a hash field, only if the field does not exist.
   */
  hsetnx(key: string, field: string, value: string): Promise<number>

  /**
   * Get the length of the value of a hash field.
   */
  hstrlen(key: string, field: string): Promise<number>

  /**
   * Get all the values of a hash.
   */
  hvals(key: string): Promise<string[]>

  /**
   * Increment the integer value of a key by one.
   */
  incr(key: string): Promise<number>

  /**
   * Increment the integer value of a key by the given amount.
   */
  incrby(key: string, increment: number): Promise<number>

  /**
   * Increment the float value of a key by the given amount.
   */
  incrbyfloat(key: string, increment: number): Promise<number>

  /**
   * Find all keys matching the given pattern.
   */
  keys(pattern: string): Promise<string[]>

  /**
   * Get the UNIX time stamp of the last successful save to disk.
   */
  lastsave(): Promise<number>

  /**
   * Get an element from a list by its index.
   */
  lindex(key: string, index: number): Promise<string>

  /**
   * Insert an element before or after another element in a list.
   */
  linsert(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Promise<string>

  /**
   * Get the length of a list.
   */
  llen(key: string): Promise<number>

  /**
   * Remove and get the first element in a list.
   */
  lpop(key: string): Promise<string>

  // /**
  //  * Prepend one or multiple values to a list.
  //  */
  // lpush: OverloadedKeyCommand<string, number, R>

  /**
   * Prepend a value to a list, only if the list exists.
   */
  lpushx(key: string, value: string): Promise<number>

  /**
   * Get a range of elements from a list.
   */
  lrange(key: string, start: number, stop: number): Promise<string[]>

  /**
   * Remove elements from a list.
   */
  lrem(key: string, count: number, value: string): Promise<number>

  /**
   * Set the value of an element in a list by its index.
   */
  lset(key: string, index: number, value: string): Promise<'OK'>

  /**
   * Trim a list to the specified range.
   */
  ltrim(key: string, start: number, stop: number): Promise<'OK'>

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
  move(key: string, db: string | number): Promise<void>

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
  persist(key: string): Promise<number>

  /**
   * Remove a key's time to live in milliseconds.
   */
  pexpire(key: string, milliseconds: number): Promise<number>

  /**
   * Set the expiration for a key as a UNIX timestamp specified in milliseconds.
   */
  pexpireat(key: string, millisecondsTimestamp: number): Promise<number>

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
  psetex(key: string, milliseconds: number, value: string): Promise<'OK'>

  // /**
  //  * Inspect the state of the Pub/Sub subsytem.
  //  */
  // pubsub: OverloadedCommand<string, number, R>
  // PUBSUB: OverloadedCommand<string, number, R>

  /**
   * Get the time to live for a key in milliseconds.
   */
  pttl(key: string): Promise<number>

  /**
   * Close the connection.
   */
  quit(): Promise<'OK'>

  /**
   * Return a random key from the keyspace.
   */
  randomkey(): Promise<string>

  /**
   * Enables read queries for a connection to a cluster slave node.
   */
  readonly(): Promise<string>

  /**
   * Disables read queries for a connection to cluster slave node.
   */
  readwrite(): Promise<string>

  /**
   * Rename a key.
   */
  rename(key: string, newKey: string): Promise<'OK'>

  /**
   * Rename a key, only if the new key does not exist.
   */
  renamenx(key: string, newKey: string): Promise<number>

  /**
   * Create a key using the provided serialized value, previously obtained using DUMP.
   */
  restore(key: string, ttl: number, serializedValue: string): Promise<'OK'>

  /**
   * Return the role of the instance in the context of replication.
   */
  role(): Promise<[string, number, Array<[string, string, string]>]>

  /**
   * Remove and get the last element in a list.
   */
  rpop(key: string): Promise<string>

  /**
   * Remove the last element in a list, prepend it to another list and return it.
   */
  rpoplpush(source: string, destination: string): Promise<string>

  // /**
  //  * Append one or multiple values to a list.
  //  */
  // rpush: OverloadedKeyCommand<string, number, R>
  // RPUSH: OverloadedKeyCommand<string, number, R>

  /**
   * Append a value to a list, only if the list exists.
   */
  rpushx(key: string, value: string): Promise<number>

  // /**
  //  * Append one or multiple members to a set.
  //  */
  // sadd: OverloadedKeyCommand<string, number, R>
  // SADD: OverloadedKeyCommand<string, number, R>

  // /**
  //  * Synchronously save the dataset to disk.
  //  */
  // save(cb?: Callback<string>): R
  // SAVE(cb?: Callback<string>): R

  // /**
  //  * Get the number of members in a set.
  //  */
  // scard(key: string, cb?: Callback<number>): R
  // SCARD(key: string, cb?: Callback<number>): R

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

  // /**
  //  * Change the selected database for the current connection.
  //  */
  // select(index: number | string, cb?: Callback<string>): R
  // SELECT(index: number | string, cb?: Callback<string>): R

  // /**
  //  * Set the string value of a key.
  //  */
  // set(key: string, value: string, cb?: Callback<'OK'>): R
  // set(key: string, value: string, flag: string, cb?: Callback<'OK'>): R
  // set(key: string, value: string, mode: string, duration: number, cb?: Callback<'OK' | undefined>): R
  // set(key: string, value: string, mode: string, duration: number, flag: string, cb?: Callback<'OK' | undefined>): R
  // SET(key: string, value: string, cb?: Callback<'OK'>): R
  // SET(key: string, value: string, flag: string, cb?: Callback<'OK'>): R
  // SET(key: string, value: string, mode: string, duration: number, cb?: Callback<'OK' | undefined>): R
  // SET(key: string, value: string, mode: string, duration: number, flag: string, cb?: Callback<'OK' | undefined>): R

  // /**
  //  * Sets or clears the bit at offset in the string value stored at key.
  //  */
  // setbit(key: string, offset: number, value: string, cb?: Callback<number>): R
  // SETBIT(key: string, offset: number, value: string, cb?: Callback<number>): R

  // /**
  //  * Set the value and expiration of a key.
  //  */
  // setex(key: string, seconds: number, value: string, cb?: Callback<string>): R
  // SETEX(key: string, seconds: number, value: string, cb?: Callback<string>): R

  // /**
  //  * Set the value of a key, only if the key does not exist.
  //  */
  // setnx(key: string, value: string, cb?: Callback<number>): R
  // SETNX(key: string, value: string, cb?: Callback<number>): R

  // /**
  //  * Overwrite part of a string at key starting at the specified offset.
  //  */
  // setrange(key: string, offset: number, value: string, cb?: Callback<number>): R
  // SETRANGE(key: string, offset: number, value: string, cb?: Callback<number>): R

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

  // /**
  //  * Determine if a given value is a member of a set.
  //  */
  // sismember(key: string, member: string, cb?: Callback<number>): R
  // SISMEMBER(key: string, member: string, cb?: Callback<number>): R

  // /**
  //  * Make the server a slave of another instance, or promote it as master.
  //  */
  // slaveof(host: string, port: string | number, cb?: Callback<string>): R
  // SLAVEOF(host: string, port: string | number, cb?: Callback<string>): R

  // /**
  //  * Manages the Redis slow queries log.
  //  */
  // slowlog: OverloadedCommand<string, Array<[number, number, number, string[]]>, R>
  // SLOWLOG: OverloadedCommand<string, Array<[number, number, number, string[]]>, R>

  // /**
  //  * Get all the members in a set.
  //  */
  // smembers(key: string, cb?: Callback<string[]>): R
  // SMEMBERS(key: string, cb?: Callback<string[]>): R

  // /**
  //  * Move a member from one set to another.
  //  */
  // smove(source: string, destination: string, member: string, cb?: Callback<number>): R
  // SMOVE(source: string, destination: string, member: string, cb?: Callback<number>): R

  // /**
  //  * Sort the elements in a list, set or sorted set.
  //  */
  // sort: OverloadedCommand<string, string[], R>
  // SORT: OverloadedCommand<string, string[], R>

  // /**
  //  * Remove and return one or multiple random members from a set.
  //  */
  // spop(key: string, cb?: Callback<string>): R
  // spop(key: string, count: number, cb?: Callback<string[]>): R
  // SPOP(key: string, cb?: Callback<string>): R
  // SPOP(key: string, count: number, cb?: Callback<string[]>): R

  // /**
  //  * Get one or multiple random members from a set.
  //  */
  // srandmember(key: string, cb?: Callback<string>): R
  // srandmember(key: string, count: number, cb?: Callback<string[]>): R
  // SRANDMEMBER(key: string, cb?: Callback<string>): R
  // SRANDMEMBER(key: string, count: number, cb?: Callback<string[]>): R

  // /**
  //  * Remove one or more members from a set.
  //  */
  // srem: OverloadedKeyCommand<string, number, R>
  // SREM: OverloadedKeyCommand<string, number, R>

  // /**
  //  * Get the length of the value stored in a key.
  //  */
  // strlen(key: string, cb?: Callback<number>): R
  // STRLEN(key: string, cb?: Callback<number>): R

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

  // /**
  //  * Internal command used for replication.
  //  */
  // sync(cb?: Callback<undefined>): R
  // SYNC(cb?: Callback<undefined>): R

  // /**
  //  * Return the current server time.
  //  */
  // time(cb?: Callback<[string, string]>): R
  // TIME(cb?: Callback<[string, string]>): R

  // /**
  //  * Get the time to live for a key.
  //  */
  // ttl(key: string, cb?: Callback<number>): R
  // TTL(key: string, cb?: Callback<number>): R

  // /**
  //  * Determine the type stored at key.
  //  */
  // type(key: string, cb?: Callback<string>): R
  // TYPE(key: string, cb?: Callback<string>): R

  // /**
  //  * Forget about all watched keys.
  //  */
  // unwatch(cb?: Callback<'OK'>): R
  // UNWATCH(cb?: Callback<'OK'>): R

  // /**
  //  * Wait for the synchronous replication of all the write commands sent in the context of the current connection.
  //  */
  // wait(numslaves: number, timeout: number, cb?: Callback<number>): R
  // WAIT(numslaves: number, timeout: number, cb?: Callback<number>): R

  // /**
  //  * Watch the given keys to determine execution of the MULTI/EXEC block.
  //  */
  // watch: OverloadedCommand<string, 'OK', R>
  // WATCH: OverloadedCommand<string, 'OK', R>

  // /**
  //  * Add one or more members to a sorted set, or update its score if it already exists.
  //  */
  // zadd: OverloadedKeyCommand<string | number, number, R>
  // ZADD: OverloadedKeyCommand<string | number, number, R>

  // /**
  //  * Get the number of members in a sorted set.
  //  */
  // zcard(key: string, cb?: Callback<number>): R
  // ZCARD(key: string, cb?: Callback<number>): R

  // /**
  //  * Count the members in a sorted set with scores between the given values.
  //  */
  // zcount(key: string, min: number | string, max: number | string, cb?: Callback<number>): R
  // ZCOUNT(key: string, min: number | string, max: number | string, cb?: Callback<number>): R

  // /**
  //  * Increment the score of a member in a sorted set.
  //  */
  // zincrby(key: string, increment: number, member: string, cb?: Callback<number>): R
  // ZINCRBY(key: string, increment: number, member: string, cb?: Callback<number>): R

  // /**
  //  * Intersect multiple sorted sets and store the resulting sorted set in a new key.
  //  */
  // zinterstore: OverloadedCommand<string | number, number, R>
  // ZINTERSTORE: OverloadedCommand<string | number, number, R>

  // /**
  //  * Count the number of members in a sorted set between a given lexicographic range.
  //  */
  // zlexcount(key: string, min: string, max: string, cb?: Callback<number>): R
  // ZLEXCOUNT(key: string, min: string, max: string, cb?: Callback<number>): R

  // /**
  //  * Return a range of members in a sorted set, by index.
  //  */
  // zrange(key: string, start: number, stop: number, cb?: Callback<string[]>): R
  // zrange(key: string, start: number, stop: number, withscores: string, cb?: Callback<string[]>): R
  // ZRANGE(key: string, start: number, stop: number, cb?: Callback<string[]>): R
  // ZRANGE(key: string, start: number, stop: number, withscores: string, cb?: Callback<string[]>): R

  // /**
  //  * Return a range of members in a sorted set, by lexicographical range.
  //  */
  // zrangebylex(key: string, min: string, max: string, cb?: Callback<string[]>): R
  // zrangebylex(
  //   key: string,
  //   min: string,
  //   max: string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R
  // ZRANGEBYLEX(key: string, min: string, max: string, cb?: Callback<string[]>): R
  // ZRANGEBYLEX(
  //   key: string,
  //   min: string,
  //   max: string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R

  // /**
  //  * Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
  //  */
  // zrevrangebylex(key: string, min: string, max: string, cb?: Callback<string[]>): R
  // zrevrangebylex(
  //   key: string,
  //   min: string,
  //   max: string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R
  // ZREVRANGEBYLEX(key: string, min: string, max: string, cb?: Callback<string[]>): R
  // ZREVRANGEBYLEX(
  //   key: string,
  //   min: string,
  //   max: string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R

  // /**
  //  * Return a range of members in a sorted set, by score.
  //  */
  // zrangebyscore(key: string, min: number | string, max: number | string, cb?: Callback<string[]>): R
  // zrangebyscore(key: string, min: number | string, max: number | string, withscores: string, cb?: Callback<string[]>): R
  // zrangebyscore(
  //   key: string,
  //   min: number | string,
  //   max: number | string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R
  // zrangebyscore(
  //   key: string,
  //   min: number | string,
  //   max: number | string,
  //   withscores: string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R
  // ZRANGEBYSCORE(key: string, min: number | string, max: number | string, cb?: Callback<string[]>): R
  // ZRANGEBYSCORE(key: string, min: number | string, max: number | string, withscores: string, cb?: Callback<string[]>): R
  // ZRANGEBYSCORE(
  //   key: string,
  //   min: number | string,
  //   max: number | string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R
  // ZRANGEBYSCORE(
  //   key: string,
  //   min: number | string,
  //   max: number | string,
  //   withscores: string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R

  // /**
  //  * Determine the index of a member in a sorted set.
  //  */
  // zrank(key: string, member: string, cb?: Callback<number | undefined>): R
  // ZRANK(key: string, member: string, cb?: Callback<number | undefined>): R

  // /**
  //  * Remove one or more members from a sorted set.
  //  */
  // zrem: OverloadedKeyCommand<string, number, R>
  // ZREM: OverloadedKeyCommand<string, number, R>

  // /**
  //  * Remove all members in a sorted set between the given lexicographical range.
  //  */
  // zremrangebylex(key: string, min: string, max: string, cb?: Callback<number>): R
  // ZREMRANGEBYLEX(key: string, min: string, max: string, cb?: Callback<number>): R

  // /**
  //  * Remove all members in a sorted set within the given indexes.
  //  */
  // zremrangebyrank(key: string, start: number, stop: number, cb?: Callback<number>): R
  // ZREMRANGEBYRANK(key: string, start: number, stop: number, cb?: Callback<number>): R

  // /**
  //  * Remove all members in a sorted set within the given indexes.
  //  */
  // zremrangebyscore(key: string, min: string | number, max: string | number, cb?: Callback<number>): R
  // ZREMRANGEBYSCORE(key: string, min: string | number, max: string | number, cb?: Callback<number>): R

  // /**
  //  * Return a range of members in a sorted set, by index, with scores ordered from high to low.
  //  */
  // zrevrange(key: string, start: number, stop: number, cb?: Callback<string[]>): R
  // zrevrange(key: string, start: number, stop: number, withscores: string, cb?: Callback<string[]>): R
  // ZREVRANGE(key: string, start: number, stop: number, cb?: Callback<string[]>): R
  // ZREVRANGE(key: string, start: number, stop: number, withscores: string, cb?: Callback<string[]>): R

  // /**
  //  * Return a range of members in a sorted set, by score, with scores ordered from high to low.
  //  */
  // zrevrangebyscore(key: string, min: number | string, max: number | string, cb?: Callback<string[]>): R
  // zrevrangebyscore(
  //   key: string,
  //   min: number | string,
  //   max: number | string,
  //   withscores: string,
  //   cb?: Callback<string[]>
  // ): R
  // zrevrangebyscore(
  //   key: string,
  //   min: number | string,
  //   max: number | string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R
  // zrevrangebyscore(
  //   key: string,
  //   min: number | string,
  //   max: number | string,
  //   withscores: string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R
  // ZREVRANGEBYSCORE(key: string, min: number | string, max: number | string, cb?: Callback<string[]>): R
  // ZREVRANGEBYSCORE(
  //   key: string,
  //   min: number | string,
  //   max: number | string,
  //   withscores: string,
  //   cb?: Callback<string[]>
  // ): R
  // ZREVRANGEBYSCORE(
  //   key: string,
  //   min: number | string,
  //   max: number | string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R
  // ZREVRANGEBYSCORE(
  //   key: string,
  //   min: number | string,
  //   max: number | string,
  //   withscores: string,
  //   limit: string,
  //   offset: number,
  //   count: number,
  //   cb?: Callback<string[]>
  // ): R

  // /**
  //  * Determine the index of a member in a sorted set, with scores ordered from high to low.
  //  */
  // zrevrank(key: string, member: string, cb?: Callback<number | undefined>): R
  // ZREVRANK(key: string, member: string, cb?: Callback<number | undefined>): R

  // /**
  //  * Get the score associated with the given member in a sorted set.
  //  */
  // zscore(key: string, member: string, cb?: Callback<string>): R
  // ZSCORE(key: string, member: string, cb?: Callback<string>): R

  // /**
  //  * Add multiple sorted sets and store the resulting sorted set in a new key.
  //  */
  // zunionstore: OverloadedCommand<string | number, number, R>
  // ZUNIONSTORE: OverloadedCommand<string | number, number, R>

  // /**
  //  * Incrementally iterate the keys space.
  //  */
  // scan: OverloadedCommand<string, [string, string[]], R>
  // SCAN: OverloadedCommand<string, [string, string[]], R>

  // /**
  //  * Incrementally iterate Set elements.
  //  */
  // sscan: OverloadedKeyCommand<string, [string, string[]], R>
  // SSCAN: OverloadedKeyCommand<string, [string, string[]], R>

  // /**
  //  * Incrementally iterate hash fields and associated values.
  //  */
  // hscan: OverloadedKeyCommand<string, [string, string[]], R>
  // HSCAN: OverloadedKeyCommand<string, [string, string[]], R>

  // /**
  //  * Incrementally iterate sorted sets elements and associated scores.
  //  */
  // zscan: OverloadedKeyCommand<string, [string, string[]], R>
  // ZSCAN: OverloadedKeyCommand<string, [string, string[]], R>
}
