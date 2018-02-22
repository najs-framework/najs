"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const Facade_1 = require("../facades/Facade");
const ConfigFacade_1 = require("../facades/global/ConfigFacade");
const register_1 = require("../core/register");
const Redis = require("redis");
class RedisClient extends Facade_1.Facade {
    constructor() {
        super();
        this.bucket = {};
        this.createClient('default', ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Redis, {
            host: 'localhost',
            port: 6379
        }));
        this.useClient('default');
    }
    getClassName() {
        return constants_1.GlobalFacadeClass.Redis;
    }
    createClient(name, options) {
        if (!this.bucket[name]) {
            this.bucket[name] = Redis.createClient(options);
        }
        return this.bucket[name];
    }
    useClient(name) {
        if (!this.bucket[name]) {
            throw new Error(`RedisClient "${name}" is not found`);
        }
        this.currentBucket = name;
        return this;
    }
    getClient(name) {
        if (!this.bucket[name]) {
            throw new Error(`RedisClient "${name}" is not found`);
        }
        return this.bucket[name];
    }
    getCurrentClient() {
        return this.currentBucket;
    }
    hasClient(name) {
        return !!this.bucket[name];
    }
    redisClientProxy(method, args) {
        return new Promise((resolve, reject) => {
            Reflect.apply(Redis.RedisClient.prototype[method], this.bucket[this.currentBucket], Array.from(args).concat([
                function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            ]));
        });
    }
    // -------------------------------------------------------------------------------------------------------------------
    /**
     * Listen for all requests received by the server in real time.
     */
    monitor() {
        return this.redisClientProxy('monitor', arguments);
    }
    info() {
        return this.redisClientProxy('info', arguments);
    }
    ping() {
        return this.redisClientProxy('ping', arguments);
    }
    /**
     * Post a message to a channel.
     */
    publish(channel, value) {
        return this.redisClientProxy('publish', arguments);
    }
    /**
     * KILL - Kill the connection of a client.
     * LIST - Get the list of client connections.
     * GETNAME - Get the current connection name.
     * PAUSE - Stop processing commands from clients for some time.
     * REPLY - Instruct the server whether to reply to commands.
     * SETNAME - Set the current connection name.
     */
    client(...args) {
        return this.redisClientProxy('client', arguments);
    }
    hmset() {
        return this.redisClientProxy('hmset', arguments);
    }
    subscribe() {
        return this.redisClientProxy('subscribe', arguments);
    }
    unsubscribe() {
        return this.redisClientProxy('unsubscribe', arguments);
    }
    psubscribe() {
        return this.redisClientProxy('psubscribe', arguments);
    }
    punsubscribe() {
        return this.redisClientProxy('punsubscribe', arguments);
    }
    /**
     * Authenticate to the server.
     */
    auth(password) {
        return this.redisClientProxy('auth', arguments);
    }
    /**
     * Append a value to a key.
     */
    append(key, value) {
        return this.redisClientProxy('append', arguments);
    }
    /**
     * Asynchronously rewrite the append-only file.
     */
    bgrewriteaof() {
        return this.redisClientProxy('bgrewriteaof', arguments);
    }
    /**
     * Asynchronously save the dataset to disk.
     */
    bgsave() {
        return this.redisClientProxy('bgsave', arguments);
    }
    bitcount() {
        return this.redisClientProxy('bitcount', arguments);
    }
    bitfield() {
        return this.redisClientProxy('bitfield', arguments);
    }
    /**
     * Perform bitwise operations between strings.
     */
    bitop(operation, destKey, args) {
        return this.redisClientProxy('bitop', arguments);
    }
    bitpos() {
        return this.redisClientProxy('bitpos', arguments);
    }
    blpop() {
        return this.redisClientProxy('blpop', arguments);
    }
    brpop() {
        return this.redisClientProxy('brpop', arguments);
    }
    /**
     * Pop a value from a list, push it to another list and return it; or block until one is available.
     */
    brpoplpush(source, destination, timeout) {
        return this.redisClientProxy('brpoplpush', arguments);
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
    cluster(...args) {
        return this.redisClientProxy('cluster', arguments);
    }
    /**
     * Get array of Redis command details.
     *
     * COUNT - Get total number of Redis commands.
     * GETKEYS - Extract keys given a full Redis command.
     * INFO - Get array of specific REdis command details.
     */
    command() {
        return this.redisClientProxy('command', arguments);
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
    config(...args) {
        return this.redisClientProxy('config', arguments);
    }
    /**
     * Return the number of keys in the selected database.
     */
    dbsize() {
        return this.redisClientProxy('dbsize', arguments);
    }
    /**
     * OBJECT - Get debugging information about a key.
     * SEGFAULT - Make the server crash.
     */
    debug(...args) {
        return this.redisClientProxy('debug', arguments);
    }
    /**
     * Decrement the integer value of a key by one.
     */
    decr(key) {
        return this.redisClientProxy('decr', arguments);
    }
    /**
     * Decrement the integer value of a key by the given number.
     */
    decrby(key, decrement) {
        return this.redisClientProxy('decrby', arguments);
    }
    /**
     * Delete a key.
     */
    del(...args) {
        return this.redisClientProxy('del', arguments);
    }
    /**
     * Discard all commands issued after MULTI.
     */
    discard() {
        return this.redisClientProxy('discard', arguments);
    }
    /**
     * Return a serialized version of the value stored at the specified key.
     */
    dump(key) {
        return this.redisClientProxy('dump', arguments);
    }
    /**
     * Echo the given string.
     */
    echo(message) {
        return this.redisClientProxy('echo', arguments);
    }
    /**
     * Execute a Lua script server side.
     */
    eval(...args) {
        return this.redisClientProxy('eval', arguments);
    }
    /**
     * Execute a Lue script server side.
     */
    evalsha(...args) {
        return this.redisClientProxy('evalsha', arguments);
    }
    /**
     * Determine if a key exists.
     */
    exists(...args) {
        return this.redisClientProxy('exists', arguments);
    }
    /**
     * Set a key's time to live in seconds.
     */
    expire(key, seconds) {
        return this.redisClientProxy('expire', arguments);
    }
    /**
     * Set the expiration for a key as a UNIX timestamp.
     */
    expireat(key, timestamp) {
        return this.redisClientProxy('expireat', arguments);
    }
    /**
     * Remove all keys from all databases.
     */
    flushall() {
        return this.redisClientProxy('flushall', arguments);
    }
    /**
     * Remove all keys from the current database.
     */
    flushdb() {
        return this.redisClientProxy('flushdb', arguments);
    }
    geoadd() {
        return this.redisClientProxy('geoadd', arguments);
    }
    geohash() {
        return this.redisClientProxy('geohash', arguments);
    }
    geopos() {
        return this.redisClientProxy('geopos', arguments);
    }
    geodist() {
        return this.redisClientProxy('geodist', arguments);
    }
    georadius() {
        return this.redisClientProxy('georadius', arguments);
    }
    georadiusbymember() {
        return this.redisClientProxy('georadiusbymember', arguments);
    }
    /**
     * Get the value of a key.
     */
    get(key) {
        return this.redisClientProxy('get', arguments);
    }
    /**
     * Returns the bit value at offset in the string value stored at key.
     */
    getbit(key, offset) {
        return this.redisClientProxy('getbit', arguments);
    }
    /**
     * Get a substring of the string stored at a key.
     */
    getrange(key, start, end) {
        return this.redisClientProxy('getrange', arguments);
    }
    /**
     * Set the string value of a key and return its old value.
     */
    getset(key, value) {
        return this.redisClientProxy('getset', arguments);
    }
    hdel() {
        return this.redisClientProxy('hdel', arguments);
    }
    /**
     * Determine if a hash field exists.
     */
    hexists(key, field) {
        return this.redisClientProxy('hexists', arguments);
    }
    /**
     * Get the value of a hash field.
     */
    hget(key, field) {
        return this.redisClientProxy('hget', arguments);
    }
    /**
     * Get all fields and values in a hash.
     */
    hgetall(key) {
        return this.redisClientProxy('hgetall', arguments);
    }
    /**
     * Increment the integer value of a hash field by the given number.
     */
    hincrby(key, field, increment) {
        return this.redisClientProxy('hincrby', arguments);
    }
    /**
     * Increment the float value of a hash field by the given amount.
     */
    hincrbyfloat(key, field, increment) {
        return this.redisClientProxy('hincrbyfloat', arguments);
    }
    /**
     * Get all the fields of a hash.
     */
    hkeys(key) {
        return this.redisClientProxy('hkeys', arguments);
    }
    /**
     * Get the number of fields in a hash.
     */
    hlen(key) {
        return this.redisClientProxy('hlen', arguments);
    }
    hmget() {
        return this.redisClientProxy('hmget', arguments);
    }
    /**
     * Set the string value of a hash field.
     */
    hset(key, field, value) {
        return this.redisClientProxy('hset', arguments);
    }
    /**
     * Set the value of a hash field, only if the field does not exist.
     */
    hsetnx(key, field, value) {
        return this.redisClientProxy('hsetnx', arguments);
    }
    /**
     * Get the length of the value of a hash field.
     */
    hstrlen(key, field) {
        return this.redisClientProxy('hstrlen', arguments);
    }
    /**
     * Get all the values of a hash.
     */
    hvals(key) {
        return this.redisClientProxy('hvals', arguments);
    }
    /**
     * Increment the integer value of a key by one.
     */
    incr(key) {
        return this.redisClientProxy('incr', arguments);
    }
    /**
     * Increment the integer value of a key by the given amount.
     */
    incrby(key, increment) {
        return this.redisClientProxy('incrby', arguments);
    }
    /**
     * Increment the float value of a key by the given amount.
     */
    incrbyfloat(key, increment) {
        return this.redisClientProxy('incrbyfloat', arguments);
    }
    /**
     * Find all keys matching the given pattern.
     */
    keys(pattern) {
        return this.redisClientProxy('keys', arguments);
    }
    /**
     * Get the UNIX time stamp of the last successful save to disk.
     */
    lastsave() {
        return this.redisClientProxy('lastsave', arguments);
    }
    /**
     * Get an element from a list by its index.
     */
    lindex(key, index) {
        return this.redisClientProxy('lindex', arguments);
    }
    /**
     * Insert an element before or after another element in a list.
     */
    linsert(key, dir, pivot, value) {
        return this.redisClientProxy('linsert', arguments);
    }
    /**
     * Get the length of a list.
     */
    llen(key) {
        return this.redisClientProxy('llen', arguments);
    }
    /**
     * Remove and get the first element in a list.
     */
    lpop(key) {
        return this.redisClientProxy('lpop', arguments);
    }
    lpush() {
        return this.redisClientProxy('lpush', arguments);
    }
    /**
     * Prepend a value to a list, only if the list exists.
     */
    lpushx(key, value) {
        return this.redisClientProxy('lpushx', arguments);
    }
    /**
     * Get a range of elements from a list.
     */
    lrange(key, start, stop) {
        return this.redisClientProxy('lrange', arguments);
    }
    /**
     * Remove elements from a list.
     */
    lrem(key, count, value) {
        return this.redisClientProxy('lrem', arguments);
    }
    /**
     * Set the value of an element in a list by its index.
     */
    lset(key, index, value) {
        return this.redisClientProxy('lset', arguments);
    }
    /**
     * Trim a list to the specified range.
     */
    ltrim(key, start, stop) {
        return this.redisClientProxy('ltrim', arguments);
    }
    /**
     * Get the values of all given keys.
     */
    mget(...args) {
        return this.redisClientProxy('mget', arguments);
    }
    /**
     * Atomically transfer a key from a Redis instance to another one.
     */
    migrate(...args) {
        return this.redisClientProxy('migrate', arguments);
    }
    /**
     * Move a key to another database.
     */
    move(key, db) {
        return this.redisClientProxy('move', arguments);
    }
    /**
     * Set multiple keys to multiple values.
     */
    mset(...args) {
        return this.redisClientProxy('mset', arguments);
    }
    /**
     * Set multiple keys to multiple values, only if none of the keys exist.
     */
    msetnx(...args) {
        return this.redisClientProxy('msetnx', arguments);
    }
    /**
     * Inspect the internals of Redis objects.
     */
    object(...args) {
        return this.redisClientProxy('object', arguments);
    }
    /**
     * Remove the expiration from a key.
     */
    persist(key) {
        return this.redisClientProxy('persist', arguments);
    }
    /**
     * Remove a key's time to live in milliseconds.
     */
    pexpire(key, milliseconds) {
        return this.redisClientProxy('pexpire', arguments);
    }
    /**
     * Set the expiration for a key as a UNIX timestamp specified in milliseconds.
     */
    pexpireat(key, millisecondsTimestamp) {
        return this.redisClientProxy('pexpireat', arguments);
    }
    pfadd() {
        return this.redisClientProxy('pfadd', arguments);
    }
    /**
     * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
     */
    pfcount(...args) {
        return this.redisClientProxy('pfcount', arguments);
    }
    /**
     * Merge N different HyperLogLogs into a single one.
     */
    pfmerge(...args) {
        return this.redisClientProxy('pfmerge', arguments);
    }
    /**
     * Set the value and expiration in milliseconds of a key.
     */
    psetex(key, milliseconds, value) {
        return this.redisClientProxy('psetex', arguments);
    }
    /**
     * Inspect the state of the Pub/Sub subsystem.
     */
    pubsub(...args) {
        return this.redisClientProxy('pubsub', arguments);
    }
    /**
     * Get the time to live for a key in milliseconds.
     */
    pttl(key) {
        return this.redisClientProxy('pttl', arguments);
    }
    /**
     * Close the connection.
     */
    quit() {
        return this.redisClientProxy('quit', arguments);
    }
    /**
     * Return a random key from the keyspace.
     */
    randomkey() {
        return this.redisClientProxy('randomkey', arguments);
    }
    /**
     * Enables read queries for a connection to a cluster slave node.
     */
    readonly() {
        return this.redisClientProxy('readonly', arguments);
    }
    /**
     * Disables read queries for a connection to cluster slave node.
     */
    readwrite() {
        return this.redisClientProxy('readwrite', arguments);
    }
    /**
     * Rename a key.
     */
    rename(key, newKey) {
        return this.redisClientProxy('rename', arguments);
    }
    /**
     * Rename a key, only if the new key does not exist.
     */
    renamenx(key, newKey) {
        return this.redisClientProxy('renamenx', arguments);
    }
    /**
     * Create a key using the provided serialized value, previously obtained using DUMP.
     */
    restore(key, ttl, serializedValue) {
        return this.redisClientProxy('restore', arguments);
    }
    /**
     * Return the role of the instance in the context of replication.
     */
    role() {
        return this.redisClientProxy('role', arguments);
    }
    /**
     * Remove and get the last element in a list.
     */
    rpop(key) {
        return this.redisClientProxy('rpop', arguments);
    }
    /**
     * Remove the last element in a list, prepend it to another list and return it.
     */
    rpoplpush(source, destination) {
        return this.redisClientProxy('rpoplpush', arguments);
    }
    rpush() {
        return this.redisClientProxy('rpush', arguments);
    }
    /**
     * Append a value to a list, only if the list exists.
     */
    rpushx(key, value) {
        return this.redisClientProxy('rpushx', arguments);
    }
    sadd() {
        return this.redisClientProxy('sadd', arguments);
    }
    /**
     * Synchronously save the dataset to disk.
     */
    save() {
        return this.redisClientProxy('save', arguments);
    }
    /**
     * Get the number of members in a set.
     */
    scard(key) {
        return this.redisClientProxy('scard', arguments);
    }
    /**
     * DEBUG - Set the debug mode for executed scripts.
     * EXISTS - Check existence of scripts in the script cache.
     * FLUSH - Remove all scripts from the script cache.
     * KILL - Kill the script currently in execution.
     * LOAD - Load the specified Lua script into the script cache.
     */
    script(...args) {
        return this.redisClientProxy('script', arguments);
    }
    /**
     * Subtract multiple sets.
     */
    sdiff(...args) {
        return this.redisClientProxy('sdiff', arguments);
    }
    sdiffstore() {
        return this.redisClientProxy('sdiffstore', arguments);
    }
    /**
     * Change the selected database for the current connection.
     */
    select(index) {
        return this.redisClientProxy('select', arguments);
    }
    set() {
        return this.redisClientProxy('set', arguments);
    }
    /**
     * Sets or clears the bit at offset in the string value stored at key.
     */
    setbit(key, offset, value) {
        return this.redisClientProxy('setbit', arguments);
    }
    /**
     * Set the value and expiration of a key.
     */
    setex(key, seconds, value) {
        return this.redisClientProxy('setex', arguments);
    }
    /**
     * Set the value of a key, only if the key does not exist.
     */
    setnx(key, value) {
        return this.redisClientProxy('setnx', arguments);
    }
    /**
     * Overwrite part of a string at key starting at the specified offset.
     */
    setrange(key, offset, value) {
        return this.redisClientProxy('setrange', arguments);
    }
    /**
     * Synchronously save the dataset to disk and then shut down the server.
     */
    shutdown(...args) {
        return this.redisClientProxy('shutdown', arguments);
    }
    sinter() {
        return this.redisClientProxy('sinter', arguments);
    }
    /**
     * Intersect multiple sets and store the resulting set in a key.
     */
    sinterstore(...args) {
        return this.redisClientProxy('sinterstore', arguments);
    }
    /**
     * Determine if a given value is a member of a set.
     */
    sismember(key, member) {
        return this.redisClientProxy('sismember', arguments);
    }
    /**
     * Make the server a slave of another instance, or promote it as master.
     */
    slaveof(host, port) {
        return this.redisClientProxy('slaveof', arguments);
    }
    /**
     * Manages the Redis slow queries log.
     */
    slowlog(...args) {
        return this.redisClientProxy('slowlog', arguments);
    }
    /**
     * Get all the members in a set.
     */
    smembers(key) {
        return this.redisClientProxy('smembers', arguments);
    }
    /**
     * Move a member from one set to another.
     */
    smove(source, destination, member) {
        return this.redisClientProxy('smove', arguments);
    }
    /**
     * Sort the elements in a list, set or sorted set.
     */
    sort(...args) {
        return this.redisClientProxy('sort', arguments);
    }
    spop() {
        return this.redisClientProxy('spop', arguments);
    }
    srandmember() {
        return this.redisClientProxy('srandmember', arguments);
    }
    srem() {
        return this.redisClientProxy('srem', arguments);
    }
    /**
     * Get the length of the value stored in a key.
     */
    strlen(key) {
        return this.redisClientProxy('strlen', arguments);
    }
    /**
     * Add multiple sets.
     */
    sunion(...args) {
        return this.redisClientProxy('sunion', arguments);
    }
    /**
     * Add multiple sets and store the resulting set in a key.
     */
    sunionstore(...args) {
        return this.redisClientProxy('sunionstore', arguments);
    }
    /**
     * Internal command used for replication.
     */
    sync() {
        return this.redisClientProxy('sync', arguments);
    }
    /**
     * Return the current server time.
     */
    time() {
        return this.redisClientProxy('time', arguments);
    }
    /**
     * Get the time to live for a key.
     */
    ttl(key) {
        return this.redisClientProxy('ttl', arguments);
    }
    /**
     * Determine the type stored at key.
     */
    type(key) {
        return this.redisClientProxy('type', arguments);
    }
    /**
     * Forget about all watched keys.
     */
    unwatch() {
        return this.redisClientProxy('unwatch', arguments);
    }
    /**
     * Wait for the synchronous replication of all the write commands sent in the context of the current connection.
     */
    wait(numSlaves, timeout) {
        return this.redisClientProxy('wait', arguments);
    }
    /**
     * Watch the given keys to determine execution of the MULTI/EXEC block.
     */
    watch(...args) {
        return this.redisClientProxy('watch', arguments);
    }
    zadd() {
        return this.redisClientProxy('zadd', arguments);
    }
    /**
     * Get the number of members in a sorted set.
     */
    zcard(key) {
        return this.redisClientProxy('zcard', arguments);
    }
    /**
     * Count the members in a sorted set with scores between the given values.
     */
    zcount(key, min, max) {
        return this.redisClientProxy('zcount', arguments);
    }
    /**
     * Increment the score of a member in a sorted set.
     */
    zincrby(key, increment, member) {
        return this.redisClientProxy('zincrby', arguments);
    }
    /**
     * Intersect multiple sorted sets and store the resulting sorted set in a new key.
     */
    zinterstore(...args) {
        return this.redisClientProxy('zinterstore', arguments);
    }
    /**
     * Count the number of members in a sorted set between a given lexicographic range.
     */
    zlexcount(key, min, max) {
        return this.redisClientProxy('zlexcount', arguments);
    }
    zrange() {
        return this.redisClientProxy('zrange', arguments);
    }
    zrangebylex() {
        return this.redisClientProxy('zrangebylex', arguments);
    }
    zrevrangebylex() {
        return this.redisClientProxy('zrevrangebylex', arguments);
    }
    zrangebyscore() {
        return this.redisClientProxy('zrangebyscore', arguments);
    }
    /**
     * Determine the index of a member in a sorted set.
     */
    zrank(key, member) {
        return this.redisClientProxy('zrank', arguments);
    }
    zrem() {
        return this.redisClientProxy('zrem', arguments);
    }
    /**
     * Remove all members in a sorted set between the given lexicographical range.
     */
    zremrangebylex(key, min, max) {
        return this.redisClientProxy('zremrangebylex', arguments);
    }
    /**
     * Remove all members in a sorted set within the given indexes.
     */
    zremrangebyrank(key, start, stop) {
        return this.redisClientProxy('zremrangebyrank', arguments);
    }
    /**
     * Remove all members in a sorted set within the given indexes.
     */
    zremrangebyscore(key, min, max) {
        return this.redisClientProxy('zremrangebyscore', arguments);
    }
    zrevrange() {
        return this.redisClientProxy('zrevrange', arguments);
    }
    zrevrangebyscore() {
        return this.redisClientProxy('zrevrangebyscore', arguments);
    }
    /**
     * Determine the index of a member in a sorted set, with scores ordered from high to low.
     */
    zrevrank(key, member) {
        return this.redisClientProxy('zrevrank', arguments);
    }
    /**
     * Get the score associated with the given member in a sorted set.
     */
    zscore(key, member) {
        return this.redisClientProxy('zscore', arguments);
    }
    /**
     * Add multiple sorted sets and store the resulting sorted set in a new key.
     */
    zunionstore(...args) {
        return this.redisClientProxy('zunionstore', arguments);
    }
    /**
     * Incrementally iterate the keys space.
     */
    scan(...args) {
        return this.redisClientProxy('scan', arguments);
    }
    sscan() {
        return this.redisClientProxy('sscan', arguments);
    }
    hscan() {
        return this.redisClientProxy('hscan', arguments);
    }
    zscan() {
        return this.redisClientProxy('zscan', arguments);
    }
}
RedisClient.className = constants_1.GlobalFacadeClass.Redis;
exports.RedisClient = RedisClient;
register_1.register(RedisClient);
