declare namespace Redis {
    interface RetryStrategyOptions {
        error: NodeJS.ErrnoException;
        total_retry_time: number;
        times_connected: number;
        attempt: number;
    }
    type RetryStrategy = (options: RetryStrategyOptions) => number | Error;
    interface ClientOpts {
        host?: string;
        port?: number;
        path?: string;
        url?: string;
        parser?: string;
        string_numbers?: boolean;
        return_buffers?: boolean;
        detect_buffers?: boolean;
        socket_keepalive?: boolean;
        no_ready_check?: boolean;
        enable_offline_queue?: boolean;
        retry_max_delay?: number;
        connect_timeout?: number;
        max_attempts?: number;
        retry_unfulfilled_commands?: boolean;
        auth_pass?: string;
        password?: string;
        db?: string | number;
        family?: string;
        rename_commands?: {
            [command: string]: string;
        } | null;
        tls?: any;
        prefix?: string;
        retry_strategy?: RetryStrategy;
    }
    type Callback<T> = (err: Error | null, reply: T) => void;
    interface ServerInfo {
        redis_version: string;
        versions: number[];
    }
    interface RedisPromise {
        /**
         * Listen for all requests received by the server in real time.
         */
        monitor(): Promise<undefined>;
        /**
         * Get information and statistics about the server.
         */
        info(): Promise<Redis.ServerInfo>;
        info(section?: string | string[]): Promise<Redis.ServerInfo>;
        /**
         * Ping the server.
         */
        ping(): Promise<string>;
        ping(message: string): Promise<string>;
        /**
         * Post a message to a channel.
         */
        publish(channel: string, value: string): Promise<number>;
        /**
         * Authenticate to the server.
         */
        auth(password: string): Promise<string>;
        /**
         * KILL - Kill the connection of a client.
         * LIST - Get the list of client connections.
         * GETNAME - Get the current connection name.
         * PAUSE - Stop processing commands from clients for some time.
         * REPLY - Instruct the server whether to reply to commands.
         * SETNAME - Set the current connection name.
         */
        client(...args: Array<string>): Promise<any>;
        /**
         * Set multiple hash fields to multiple values.
         */
        hmset(key: string): Promise<boolean>;
        hmset(key: string, ...args: Array<string | number>): Promise<boolean>;
        /**
         * Listen for messages published to the given channels.
         */
        subscribe(channel: string): Promise<string>;
        subscribe(channels: string[]): Promise<string>;
        subscribe(...args: string[]): Promise<string>;
        /**
         * Stop listening for messages posted to the given channels.
         */
        unsubscribe(channel: string): Promise<string>;
        unsubscribe(channels: string[]): Promise<string>;
        unsubscribe(...args: string[]): Promise<string>;
        /**
         * Listen for messages published to channels matching the given patterns.
         */
        psubscribe(channel: string): Promise<string>;
        psubscribe(channels: string[]): Promise<string>;
        psubscribe(...args: string[]): Promise<string>;
        /**
         * Stop listening for messages posted to channels matching the given patterns.
         */
        punsubscribe(channel: string): Promise<string>;
        punsubscribe(channels: string[]): Promise<string>;
        punsubscribe(...args: string[]): Promise<string>;
        /**
         * Append a value to a key.
         */
        append(key: string, value: string): Promise<number>;
        /**
         * Asynchronously rewrite the append-only file.
         */
        bgrewriteaof(): Promise<'OK'>;
        /**
         * Asynchronously save the dataset to disk.
         */
        bgsave(): Promise<string>;
        /**
         * Count set bits in a string.
         */
        bitcount(key: string): Promise<number>;
        bitcount(key: string, start: number, end: number): Promise<number>;
        /**
         * Perform arbitrary bitfield integer operations on strings.
         */
        bitfield(): Promise<[number, number]>;
        bitfield(key: string): Promise<[number, number]>;
        bitfield(key: string, ...args: Array<string | number>): Promise<[number, number]>;
        /**
         * Perform bitwise operations between strings.
         */
        bitop(operation: string, destKey: string, args: string[]): Promise<number>;
        /**
         * Find first bit set or clear in a string.
         */
        bitpos(key: string, bit: number): Promise<number>;
        bitpos(key: string, bit: number, start: number): Promise<number>;
        bitpos(key: string, bit: number, start: number, end: number): Promise<number>;
        /**
         * Remove and get the first element in a list, or block until one is available.
         */
        blpop(args: Array<string | number>): Promise<[string, string]>;
        blpop(...args: Array<string | number>): Promise<[string, string]>;
        blpop(arg1: string, arg2: number | Array<string | number>): Promise<[string, string]>;
        blpop(arg1: string, arg2: string, arg3: number): Promise<[string, string]>;
        blpop(arg1: string, arg2: string, arg3: string, arg4: number): Promise<[string, string]>;
        blpop(arg1: string, arg2: string, arg3: string, arg4: string, arg5: number): Promise<[string, string]>;
        blpop(arg1: string, arg2: string, arg3: string, arg4: string, arg5: string, arg6: number): Promise<[string, string]>;
        /**
         * Remove and get the last element in a list, or block until one is available.
         */
        brpop(args: Array<string | number>): Promise<[string, string]>;
        brpop(...args: Array<string | number>): Promise<[string, string]>;
        brpop(arg1: string, arg2: number | Array<string | number>): Promise<[string, string]>;
        brpop(arg1: string, arg2: string, arg3: number): Promise<[string, string]>;
        brpop(arg1: string, arg2: string, arg3: string, arg4: number): Promise<[string, string]>;
        brpop(arg1: string, arg2: string, arg3: string, arg4: string, arg5: number): Promise<[string, string]>;
        brpop(arg1: string, arg2: string, arg3: string, arg4: string, arg5: string, arg6: number): Promise<[string, string]>;
        /**
         * Pop a value from a list, push it to another list and return it; or block until one is available.
         */
        brpoplpush(source: string, destination: string, timeout: number): Promise<string | null>;
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
        cluster(...args: Array<string>): Promise<any>;
        /**
         * Get array of Redis command details.
         *
         * COUNT - Get total number of Redis commands.
         * GETKEYS - Extract keys given a full Redis command.
         * INFO - Get array of specific REdis command details.
         */
        command(): Promise<Array<[string, number, string[], number, number, number]>>;
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
        config(...args: Array<string>): Promise<boolean>;
        /**
         * Return the number of keys in the selected database.
         */
        dbsize(): Promise<number>;
        /**
         * OBJECT - Get debugging information about a key.
         * SEGFAULT - Make the server crash.
         */
        debug(...args: Array<string>): Promise<boolean>;
        /**
         * Decrement the integer value of a key by one.
         */
        decr(key: string): Promise<number>;
        /**
         * Decrement the integer value of a key by the given number.
         */
        decrby(key: string, decrement: number): Promise<number>;
        /**
         * Delete a key.
         */
        del(...args: Array<string>): Promise<number>;
        /**
         * Discard all commands issued after MULTI.
         */
        discard(): Promise<'OK'>;
        /**
         * Return a serialized version of the value stored at the specified key.
         */
        dump(key: string): Promise<string>;
        /**
         * Echo the given string.
         */
        echo<T extends string>(message: T): Promise<T>;
        /**
         * Execute a Lua script server side.
         */
        eval(...args: Array<string | number>): Promise<any>;
        /**
         * Execute a Lue script server side.
         */
        evalsha(...args: Array<string | number>): Promise<any>;
        /**
         * Determine if a key exists.
         */
        exists(...args: Array<string>): Promise<number>;
        /**
         * Set a key's time to live in seconds.
         */
        expire(key: string, seconds: number): Promise<number>;
        /**
         * Set the expiration for a key as a UNIX timestamp.
         */
        expireat(key: string, timestamp: number): Promise<number>;
        /**
         * Remove all keys from all databases.
         */
        flushall(): Promise<string>;
        /**
         * Remove all keys from the current database.
         */
        flushdb(): Promise<string>;
        /**
         * Add one or more geospatial items in the geospatial index represented using a sorted set.
         */
        geoadd(): Promise<number>;
        geoadd(key: string): Promise<number>;
        geoadd(key: string, ...args: Array<string | number>): Promise<number>;
        /**
         * Returns members of a geospatial index as standard geohash strings.
         */
        geohash(): Promise<string>;
        geohash(key: string): Promise<string>;
        geohash(key: string, ...args: Array<string>): Promise<string>;
        /**
         * Returns longitude and latitude of members of a geospatial index.
         */
        geopos(): Promise<Array<[number, number]>>;
        geopos(key: string): Promise<Array<[number, number]>>;
        geopos(key: string, ...args: Array<string>): Promise<Array<[number, number]>>;
        /**
         * Returns the distance between two members of a geospatial index.
         */
        geodist(): Promise<string>;
        geodist(key: string): Promise<string>;
        geodist(key: string, ...args: Array<string>): Promise<string>;
        /**
         * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point.
         */
        georadius(): Promise<Array<string | [string, string | [string, string]]>>;
        georadius(key: string): Promise<Array<string | [string, string | [string, string]]>>;
        georadius(key: string, ...args: Array<string | number>): Promise<Array<string | [string, string | [string, string]]>>;
        /**
         * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member.
         */
        georadiusbymember(): Promise<Array<string | [string, string | [string, string]]>>;
        georadiusbymember(key: string): Promise<Array<string | [string, string | [string, string]]>>;
        georadiusbymember(key: string, ...args: Array<string | number>): Promise<Array<string | [string, string | [string, string]]>>;
        /**
         * Get the value of a key.
         */
        get(key: string): Promise<string>;
        /**
         * Returns the bit value at offset in the string value stored at key.
         */
        getbit(key: string, offset: number): Promise<number>;
        /**
         * Get a substring of the string stored at a key.
         */
        getrange(key: string, start: number, end: number): Promise<string>;
        /**
         * Set the string value of a key and return its old value.
         */
        getset(key: string, value: string): Promise<string>;
        hdel(): Promise<number>;
        hdel(key: string): Promise<number>;
        hdel(key: string, ...args: Array<string>): Promise<number>;
        /**
         * Determine if a hash field exists.
         */
        hexists(key: string, field: string): Promise<number>;
        /**
         * Get the value of a hash field.
         */
        hget(key: string, field: string): Promise<string>;
        /**
         * Get all fields and values in a hash.
         */
        hgetall(key: string): Promise<{
            [key: string]: string;
        }>;
        /**
         * Increment the integer value of a hash field by the given number.
         */
        hincrby(key: string, field: string, increment: number): Promise<number>;
        /**
         * Increment the float value of a hash field by the given amount.
         */
        hincrbyfloat(key: string, field: string, increment: number): Promise<number>;
        /**
         * Get all the fields of a hash.
         */
        hkeys(key: string): Promise<string[]>;
        /**
         * Get the number of fields in a hash.
         */
        hlen(key: string): Promise<number>;
        /**
         * Get the values of all the given hash fields.
         */
        hmget(): Promise<string[]>;
        hmget(key: string): Promise<string[]>;
        hmget(key: string, ...args: Array<string>): Promise<string[]>;
        /**
         * Set the string value of a hash field.
         */
        hset(key: string, field: string, value: string): Promise<number>;
        /**
         * Set the value of a hash field, only if the field does not exist.
         */
        hsetnx(key: string, field: string, value: string): Promise<number>;
        /**
         * Get the length of the value of a hash field.
         */
        hstrlen(key: string, field: string): Promise<number>;
        /**
         * Get all the values of a hash.
         */
        hvals(key: string): Promise<string[]>;
        /**
         * Increment the integer value of a key by one.
         */
        incr(key: string): Promise<number>;
        /**
         * Increment the integer value of a key by the given amount.
         */
        incrby(key: string, increment: number): Promise<number>;
        /**
         * Increment the float value of a key by the given amount.
         */
        incrbyfloat(key: string, increment: number): Promise<number>;
        /**
         * Find all keys matching the given pattern.
         */
        keys(pattern: string): Promise<string[]>;
        /**
         * Get the UNIX time stamp of the last successful save to disk.
         */
        lastsave(): Promise<number>;
        /**
         * Get an element from a list by its index.
         */
        lindex(key: string, index: number): Promise<string>;
        /**
         * Insert an element before or after another element in a list.
         */
        linsert(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Promise<string>;
        /**
         * Get the length of a list.
         */
        llen(key: string): Promise<number>;
        /**
         * Remove and get the first element in a list.
         */
        lpop(key: string): Promise<string>;
        /**
         * Prepend one or multiple values to a list.
         */
        lpush(): Promise<number>;
        lpush(key: string): Promise<number>;
        lpush(key: string, ...args: Array<string>): Promise<number>;
        /**
         * Prepend a value to a list, only if the list exists.
         */
        lpushx(key: string, value: string): Promise<number>;
        /**
         * Get a range of elements from a list.
         */
        lrange(key: string, start: number, stop: number): Promise<string[]>;
        /**
         * Remove elements from a list.
         */
        lrem(key: string, count: number, value: string): Promise<number>;
        /**
         * Set the value of an element in a list by its index.
         */
        lset(key: string, index: number, value: string): Promise<'OK'>;
        /**
         * Trim a list to the specified range.
         */
        ltrim(key: string, start: number, stop: number): Promise<'OK'>;
        /**
         * Get the values of all given keys.
         */
        mget(...args: Array<string>): Promise<string[]>;
        /**
         * Atomically transfer a key from a Redis instance to another one.
         */
        migrate(...args: Array<string>): Promise<boolean>;
        /**
         * Move a key to another database.
         */
        move(key: string, db: string | number): Promise<void>;
        /**
         * Set multiple keys to multiple values.
         */
        mset(...args: Array<string>): Promise<boolean>;
        /**
         * Set multiple keys to multiple values, only if none of the keys exist.
         */
        msetnx(...args: Array<string>): Promise<boolean>;
        /**
         * Inspect the internals of Redis objects.
         */
        object(...args: Array<string>): Promise<any>;
        /**
         * Remove the expiration from a key.
         */
        persist(key: string): Promise<number>;
        /**
         * Remove a key's time to live in milliseconds.
         */
        pexpire(key: string, milliseconds: number): Promise<number>;
        /**
         * Set the expiration for a key as a UNIX timestamp specified in milliseconds.
         */
        pexpireat(key: string, millisecondsTimestamp: number): Promise<number>;
        /**
         * Adds the specified elements to the specified HyperLogLog.
         */
        pfadd(): Promise<number>;
        pfadd(key: string): Promise<number>;
        pfadd(key: string, ...args: Array<string>): Promise<number>;
        /**
         * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
         */
        pfcount(...args: Array<string>): Promise<number>;
        /**
         * Merge N different HyperLogLogs into a single one.
         */
        pfmerge(...args: Array<string>): Promise<boolean>;
        /**
         * Set the value and expiration in milliseconds of a key.
         */
        psetex(key: string, milliseconds: number, value: string): Promise<'OK'>;
        /**
         * Inspect the state of the Pub/Sub subsystem.
         */
        pubsub(...args: Array<string>): Promise<number>;
        /**
         * Get the time to live for a key in milliseconds.
         */
        pttl(key: string): Promise<number>;
        /**
         * Close the connection.
         */
        quit(): Promise<'OK'>;
        /**
         * Return a random key from the keyspace.
         */
        randomkey(): Promise<string>;
        /**
         * Enables read queries for a connection to a cluster slave node.
         */
        readonly(): Promise<string>;
        /**
         * Disables read queries for a connection to cluster slave node.
         */
        readwrite(): Promise<string>;
        /**
         * Rename a key.
         */
        rename(key: string, newKey: string): Promise<'OK'>;
        /**
         * Rename a key, only if the new key does not exist.
         */
        renamenx(key: string, newKey: string): Promise<number>;
        /**
         * Create a key using the provided serialized value, previously obtained using DUMP.
         */
        restore(key: string, ttl: number, serializedValue: string): Promise<'OK'>;
        /**
         * Return the role of the instance in the context of replication.
         */
        role(): Promise<[string, number, Array<[string, string, string]>]>;
        /**
         * Remove and get the last element in a list.
         */
        rpop(key: string): Promise<string>;
        /**
         * Remove the last element in a list, prepend it to another list and return it.
         */
        rpoplpush(source: string, destination: string): Promise<string>;
        /**
         * Append one or multiple values to a list.
         */
        rpush(): Promise<number>;
        rpush(key: string): Promise<number>;
        rpush(key: string, ...args: Array<string>): Promise<number>;
        /**
         * Append a value to a list, only if the list exists.
         */
        rpushx(key: string, value: string): Promise<number>;
        /**
         * Append one or multiple members to a set.
         */
        sadd(): Promise<number>;
        sadd(key: string): Promise<number>;
        sadd(key: string, ...args: Array<string>): Promise<number>;
        /**
         * Synchronously save the dataset to disk.
         */
        save(): Promise<string>;
        /**
         * Get the number of members in a set.
         */
        scard(key: string): Promise<number>;
        /**
         * DEBUG - Set the debug mode for executed scripts.
         * EXISTS - Check existence of scripts in the script cache.
         * FLUSH - Remove all scripts from the script cache.
         * KILL - Kill the script currently in execution.
         * LOAD - Load the specified Lua script into the script cache.
         */
        script(...args: Array<string>): Promise<any>;
        /**
         * Subtract multiple sets.
         */
        sdiff(...args: Array<string>): Promise<string[]>;
        /**
         * Subtract multiple sets and store the resulting set in a key.
         */
        sdiffstore(): Promise<number>;
        sdiffstore(key: string): Promise<number>;
        sdiffstore(key: string, ...args: Array<string>): Promise<number>;
        /**
         * Change the selected database for the current connection.
         */
        select(index: number | string): Promise<string>;
        /**
         * Set the string value of a key.
         */
        set(key: string, value: string): Promise<'OK'>;
        set(key: string, value: string, flag: string): Promise<'OK'>;
        set(key: string, value: string, mode: string, duration: number): Promise<'OK' | undefined>;
        set(key: string, value: string, mode: string, duration: number, flag: string): Promise<'OK' | undefined>;
        /**
         * Sets or clears the bit at offset in the string value stored at key.
         */
        setbit(key: string, offset: number, value: string): Promise<number>;
        /**
         * Set the value and expiration of a key.
         */
        setex(key: string, seconds: number, value: string): Promise<string>;
        /**
         * Set the value of a key, only if the key does not exist.
         */
        setnx(key: string, value: string): Promise<number>;
        /**
         * Overwrite part of a string at key starting at the specified offset.
         */
        setrange(key: string, offset: number, value: string): Promise<number>;
        /**
         * Synchronously save the dataset to disk and then shut down the server.
         */
        shutdown(...args: Array<string>): Promise<string>;
        /**
         * Intersect multiple sets.
         */
        sinter(): Promise<string[]>;
        sinter(key: string): Promise<string[]>;
        sinter(key: string, ...args: Array<string>): Promise<string[]>;
        /**
         * Intersect multiple sets and store the resulting set in a key.
         */
        sinterstore(...args: Array<string>): Promise<number>;
        /**
         * Determine if a given value is a member of a set.
         */
        sismember(key: string, member: string): Promise<number>;
        /**
         * Make the server a slave of another instance, or promote it as master.
         */
        slaveof(host: string, port: string | number): Promise<string>;
        /**
         * Manages the Redis slow queries log.
         */
        slowlog(...args: Array<string>): Promise<Array<[number, number, number, string[]]>>;
        /**
         * Get all the members in a set.
         */
        smembers(key: string): Promise<string[]>;
        /**
         * Move a member from one set to another.
         */
        smove(source: string, destination: string, member: string): Promise<number>;
        /**
         * Sort the elements in a list, set or sorted set.
         */
        sort(...args: Array<string>): Promise<string[]>;
        /**
         * Remove and return one or multiple random members from a set.
         */
        spop(key: string): Promise<string>;
        spop(key: string, count: number): Promise<string[]>;
        /**
         * Get one or multiple random members from a set.
         */
        srandmember(key: string): Promise<string>;
        srandmember(key: string, count: number): Promise<string[]>;
        /**
         * Remove one or more members from a set.
         */
        srem(): Promise<number>;
        srem(key: string): Promise<number>;
        srem(key: string, ...args: Array<string>): Promise<number>;
        /**
         * Get the length of the value stored in a key.
         */
        strlen(key: string): Promise<number>;
        /**
         * Add multiple sets.
         */
        sunion(...args: Array<string>): Promise<string[]>;
        /**
         * Add multiple sets and store the resulting set in a key.
         */
        sunionstore(...args: Array<string>): Promise<number>;
        /**
         * Internal command used for replication.
         */
        sync(): Promise<undefined>;
        /**
         * Return the current server time.
         */
        time(): Promise<[string, string]>;
        /**
         * Get the time to live for a key.
         */
        ttl(key: string): Promise<number>;
        /**
         * Determine the type stored at key.
         */
        type(key: string): Promise<string>;
        /**
         * Forget about all watched keys.
         */
        unwatch(): Promise<'OK'>;
        /**
         * Wait for the synchronous replication of all the write commands sent in the context of the current connection.
         */
        wait(numSlaves: number, timeout: number): Promise<number>;
        /**
         * Watch the given keys to determine execution of the MULTI/EXEC block.
         */
        watch(...args: Array<string>): Promise<'OK'>;
        /**
         * Add one or more members to a sorted set, or update its score if it already exists.
         */
        zadd(): Promise<number>;
        zadd(key: string): Promise<number>;
        zadd(key: string, ...args: Array<string | number>): Promise<number>;
        /**
         * Get the number of members in a sorted set.
         */
        zcard(key: string): Promise<number>;
        /**
         * Count the members in a sorted set with scores between the given values.
         */
        zcount(key: string, min: number | string, max: number | string): Promise<number>;
        /**
         * Increment the score of a member in a sorted set.
         */
        zincrby(key: string, increment: number, member: string): Promise<number>;
        /**
         * Intersect multiple sorted sets and store the resulting sorted set in a new key.
         */
        zinterstore(...args: Array<string | number>): Promise<number>;
        /**
         * Count the number of members in a sorted set between a given lexicographic range.
         */
        zlexcount(key: string, min: string, max: string): Promise<number>;
        /**
         * Return a range of members in a sorted set, by index.
         */
        zrange(key: string, start: number, stop: number): Promise<string[]>;
        zrange(key: string, start: number, stop: number, withScores: string): Promise<string[]>;
        /**
         * Return a range of members in a sorted set, by lexicographical range.
         */
        zrangebylex(key: string, min: string, max: string): Promise<string[]>;
        zrangebylex(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;
        /**
         * Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
         */
        zrevrangebylex(key: string, min: string, max: string): Promise<string[]>;
        zrevrangebylex(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;
        /**
         * Return a range of members in a sorted set, by score.
         */
        zrangebyscore(key: string, min: number | string, max: number | string): Promise<string[]>;
        zrangebyscore(key: string, min: number | string, max: number | string, withScores: string): Promise<string[]>;
        zrangebyscore(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;
        zrangebyscore(key: string, min: number | string, max: number | string, withScores: string, limit: string, offset: number, count: number): Promise<string[]>;
        /**
         * Determine the index of a member in a sorted set.
         */
        zrank(key: string, member: string): Promise<number | undefined>;
        /**
         * Remove one or more members from a sorted set.
         */
        zrem(): Promise<number>;
        zrem(key: string): Promise<number>;
        zrem(key: string, ...args: Array<string>): Promise<number>;
        /**
         * Remove all members in a sorted set between the given lexicographical range.
         */
        zremrangebylex(key: string, min: string, max: string): Promise<number>;
        /**
         * Remove all members in a sorted set within the given indexes.
         */
        zremrangebyrank(key: string, start: number, stop: number): Promise<number>;
        /**
         * Remove all members in a sorted set within the given indexes.
         */
        zremrangebyscore(key: string, min: string | number, max: string | number): Promise<number>;
        /**
         * Return a range of members in a sorted set, by index, with scores ordered from high to low.
         */
        zrevrange(key: string, start: number, stop: number): Promise<string[]>;
        zrevrange(key: string, start: number, stop: number, withScores: string): Promise<string[]>;
        /**
         * Return a range of members in a sorted set, by score, with scores ordered from high to low.
         */
        zrevrangebyscore(key: string, min: number | string, max: number | string): Promise<string[]>;
        zrevrangebyscore(key: string, min: number | string, max: number | string, withScores: string): Promise<string[]>;
        zrevrangebyscore(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;
        zrevrangebyscore(key: string, min: number | string, max: number | string, withScores: string, limit: string, offset: number, count: number): Promise<string[]>;
        /**
         * Determine the index of a member in a sorted set, with scores ordered from high to low.
         */
        zrevrank(key: string, member: string): Promise<number | undefined>;
        /**
         * Get the score associated with the given member in a sorted set.
         */
        zscore(key: string, member: string): Promise<string>;
        /**
         * Add multiple sorted sets and store the resulting sorted set in a new key.
         */
        zunionstore(...args: Array<string | number>): Promise<number>;
        /**
         * Incrementally iterate the keys space.
         */
        scan(...args: Array<string>): Promise<[string, string[]]>;
        /**
         * Incrementally iterate Set elements.
         */
        sscan(): Promise<[string, string[]]>;
        sscan(key: string): Promise<[string, string[]]>;
        sscan(key: string, ...args: Array<string>): Promise<[string, string[]]>;
        /**
         * Incrementally iterate hash fields and associated values.
         */
        hscan(): Promise<[string, string[]]>;
        hscan(key: string): Promise<[string, string[]]>;
        hscan(key: string, ...args: Array<string>): Promise<[string, string[]]>;
        /**
         * Incrementally iterate sorted sets elements and associated scores.
         */
        zscan(): Promise<[string, string[]]>;
        zscan(key: string): Promise<[string, string[]]>;
        zscan(key: string, ...args: Array<string>): Promise<[string, string[]]>;
    }
}
