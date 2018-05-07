/// <reference types="najs-binding" />

namespace Najs.Contracts {
  export interface Cache extends Autoload {
    /**
     * Get the cached value by given key
     *
     * @param {string} key
     * @param {mixed|undefined} defaultValue
     */
    get<T>(key: string, defaultValue?: T): Promise<T>

    /**
     * Set value to cache by given key
     *
     * @param {string} key
     * @param {mixed} value
     * @param {number} ttl time to live
     */
    set<T>(key: string, value: T, ttl?: number): Promise<boolean>

    /**
     * Determine that the given key is exists or not
     *
     * @param {string} key
     */
    has(key: string): Promise<boolean>

    /**
     * Clear cache by given key
     *
     * @param {string} key
     */
    clear(key: string): Promise<boolean>

    /**
     * Get value by tag and key
     *
     * @param {string} tag
     * @param {string} key
     * @param {mixed|undefined} defaultValue
     */
    getTag<T>(tag: string, key: string, defaultValue?: T): Promise<T>

    /**
     * Set value by tag and key
     *
     * @param {string} tag
     * @param {string} key
     * @param {mixed} value
     * @param {number} ttl time to live
     */
    setTag(tag: string | string[], key: string, value: any, ttl?: number): Promise<boolean>

    /**
     * Determine that tag is exists or not.
     *
     * @param {string} tag
     */
    hasTag(tag: string): Promise<boolean>

    /**
     * Determine that tag and key is exists or not.
     */
    hasTag(tag: string, key: string): Promise<boolean>

    /**
     * Clear cache values by tag.
     *
     * @param {string} tag
     */
    clearTag(tag: string): Promise<boolean>

    /**
     * Cache the result of callback with given key. In case the key is exists extends ttl,
     * otherwise call fallback and create cache with returned value.
     *
     * @param {string} key
     * @param {number} ttl
     * @param {Function} fallback
     */
    cache<T>(key: string, ttl: number, fallback: () => Promise<T>): Promise<T>

    /**
     * Cache the result of callback with given tag and key. In case tag+key is exists extends ttl,
     * otherwise call fallback and create cache with returned value.
     *
     * @param {string|string[]} tag
     * @param {string} key
     * @param {number} ttl
     * @param {Function} fallback
     */
    cacheByTag(tag: string | Array<string>, key: string, ttl: number, fallback: () => Promise<any>): Promise<any>
  }
}
