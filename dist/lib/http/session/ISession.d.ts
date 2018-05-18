/// <reference path="../../contracts/types/http.d.ts" />
import { IRequestDataReader } from '../request/IRequestDataReader';
export declare type FlashRegistry = {
    reflash: boolean;
    keep: string[];
    flash: string[];
};
export interface ISession extends IRequestDataReader, Najs.Http.IRequestDataWriter {
    /**
     * regenerates the session ID
     */
    regenerate(): Promise<any>;
    /**
     * store value in the session, it's automatically deleted when it is get back.
     * It's useful for short-lived status messages
     *
     * @param {string} path
     * @param {mixed} value
     */
    flash(path: string, value: any): this;
    /**
     * re-flashes all flash values, do not delete when it is get back
     */
    reflash(): this;
    /**
     * keeps specific flash value, do not delete when it is get back
     * @param {string} path
     */
    keep(path: string): this;
    /**
     * keeps specific flash values, do not delete when they are get back
     * @param {string} path
     */
    keep(paths: string[]): this;
    /**
     * keeps specific flash values, do not delete when they are get back
     * @param {string} path
     */
    keep(...args: Array<string | string[]>): this;
}
