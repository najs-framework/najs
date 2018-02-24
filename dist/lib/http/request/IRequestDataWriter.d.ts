export interface IRequestDataWriter {
    /**
     * sets value to a path
     *
     * @param {string} path
     * @param {mixed} value
     */
    set<T extends any>(path: string, value: T): this;
    /**
     * an alias of .set()
     *
     * @param {string} path
     * @param {mixed} value
     */
    put<T extends any>(path: string, value: T): this;
    /**
     * an alias of .set()
     *
     * @param {string} path
     * @param {mixed} value
     */
    push<T extends any>(path: string, value: T): this;
    /**
     * retrieves and deletes an item in a single statement
     *
     * @param {string} path
     */
    pull<T extends any>(path: string): T;
    /**
     * retrieves and deletes an item in a single statement
     *
     * @param {string} path
     * @param {mixed} defaultValue
     */
    pull<T extends any>(path: string, defaultValue: T): T;
    /**
     * deletes an item by path
     *
     * @param {string} path
     */
    delete(path: string): this;
    /**
     * an alias of .delete()
     *
     * @param {string} path
     */
    remove(path: string): this;
    /**
     * an alias of .delete()
     *
     * @param {string} path
     */
    forget(path: string): this;
    /**
     * clears all items
     */
    clear(): this;
    /**
     * clears all items - an alias of .clear()
     */
    flush(): this;
}
