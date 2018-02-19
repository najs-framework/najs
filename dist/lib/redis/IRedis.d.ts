import * as Redis from 'redis';
export interface IRedis {
    /**
     * Create new redis client with a name and use it as current client
     * @param name {string} name of redis client
     * @param options {Object} redis.createClient options
     */
    createClient(name: string, options: Redis.ClientOpts): Redis.RedisClient;
    /**
     * Get native redis client
     * @param name {string} name of redis client
     */
    getClient(name: string): Redis.RedisClient;
    /**
     * Determines that client with name has been created or not
     * @param name {string} name of redis client
     */
    hasClient(name: string): boolean;
    /**
     * Switch current client which wrapped by this class
     * @param name {string} name of redis client
     */
    useClient(name: string): this;
    /**
     * Get current redis client
     */
    getCurrentClient(): string;
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
}
