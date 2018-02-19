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
    bgRewriteAOF(): Promise<'OK'>;
    /**
     * Asynchronously save the dataset to disk.
     */
    bgSave(): Promise<string>;
    /**
     * Count set bits in a string.
     */
    bitCount(key: string): Promise<number>;
    bitCount(key: string, start: number, end: number): Promise<number>;
    /**
     * Perform arbitrary bitfield integer operations on strings.
     */
    bitField(key: string, arg: Array<string | number>): Promise<[number, number]>;
    bitField(key: string, ...args: Array<string | number>): Promise<[number, number]>;
}
