import { IAutoload } from './../core/IAutoload';
import { IRedis } from './IRedis';
import { Facade } from '../facades/Facade';
import * as Redis from 'redis';
export declare class RedisClient extends Facade implements IRedis, IAutoload {
    static className: string;
    protected bucket: {
        [key: string]: Redis.RedisClient;
    };
    protected currentBucket: string;
    constructor();
    getClassName(): string;
    createClient(name: string, options: Redis.ClientOpts): Redis.RedisClient;
    useClient(name: string): this;
    getClient(name: string): Redis.RedisClient;
    getCurrentClient(): string;
    hasClient(name: string): boolean;
    private redisClientProxy(method, args);
    /**
     * Append a value to a key.
     */
    append(key: string, value: string): Promise<number>;
    /**
     * Authenticate to the server.
     */
    auth(password: string): Promise<string>;
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
    bitfield(key: string, arg: Array<string | number>): Promise<[number, number]>;
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
     * Pop a value from a list, push it to another list and return it; or block until one is available.
     */
    brpoplpush(source: string, destination: string, timeout: number): Promise<string | null>;
    /**
     * Get array of Redis command details.
     *
     * COUNT - Get total number of Redis commands.
     * GETKEYS - Extract keys given a full Redis command.
     * INFO - Get array of specific REdis command details.
     */
    command(): Promise<Array<[string, number, string[], number, number, number]>>;
    /**
     * Return the number of keys in the selected database.
     */
    dbsize(): Promise<number>;
    /**
     * Decrement the integer value of a key by one.
     */
    decr(key: string): Promise<number>;
    /**
     * Decrement the integer value of a key by the given number.
     */
    decrby(key: string, decrement: number): Promise<number>;
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
     * Move a key to another database.
     */
    move(key: string, db: string | number): Promise<void>;
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
     * Set the value and expiration in milliseconds of a key.
     */
    psetex(key: string, milliseconds: number, value: string): Promise<'OK'>;
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
     * Append a value to a list, only if the list exists.
     */
    rpushx(key: string, value: string): Promise<number>;
    /**
     * Synchronously save the dataset to disk.
     */
    save(): Promise<string>;
    /**
     * Get the number of members in a set.
     */
    scard(key: string): Promise<number>;
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
     * Determine if a given value is a member of a set.
     */
    sismember(key: string, member: string): Promise<number>;
    /**
     * Make the server a slave of another instance, or promote it as master.
     */
    slaveof(host: string, port: string | number): Promise<string>;
    /**
     * Get all the members in a set.
     */
    smembers(key: string): Promise<string[]>;
    /**
     * Move a member from one set to another.
     */
    smove(source: string, destination: string, member: string): Promise<number>;
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
     * Get the length of the value stored in a key.
     */
    strlen(key: string): Promise<number>;
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
}
