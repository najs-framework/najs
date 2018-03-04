/// <reference types="express" />
import { IAutoload } from 'najs-binding';
import { ContextualFacade } from 'najs-facade';
import { SetCookieOptions, ICookie } from './ICookie';
import { Controller } from '../controller/Controller';
import { Response } from 'express';
export declare class Cookie extends ContextualFacade<Controller> implements ICookie, IAutoload {
    protected data: Object;
    protected cookies: Object;
    protected signedCookies: Object;
    constructor(controller: Controller);
    getClassName(): string;
    protected getResponse(): Response;
    isSigned(name: string): boolean;
    isSigned(names: string[]): boolean;
    isSigned(...args: Array<string | string[]>): boolean;
    get<T extends any>(path: string): T;
    get<T extends any>(path: string, defaultValue: T): T;
    has(path: string): boolean;
    has(path: string, signed: boolean): boolean;
    /**
     * returns true if the item is present
     *
     * @param {string} path
     */
    exists(path: string): boolean;
    /**
     * returns true if the item is present
     *
     * @param {string} path
     * @param {boolean} signed
     */
    exists(path: string, signed: boolean): boolean;
    all(): Object;
    all(signed: boolean): Object;
    /**
     * gets items defined in params list
     *
     * @param {string} path
     */
    only(path: string): Object;
    only(paths: string[]): Object;
    except(path: string): Object;
    except(paths: string[]): Object;
    except(...args: Array<string | string[]>): Object;
    forget(name: string): this;
    forget(name: string, path: string): this;
    forget(name: string, path: string, domain: string): this;
    forget(name: string, options: SetCookieOptions): this;
    make(name: string, value: any): this;
    make(name: string, value: any, signed: boolean): this;
    make(name: string, value: any, signed: boolean, minutes: number): this;
    make(name: string, value: any, signed: boolean, minutes: number, path: string): this;
    make(name: string, value: any, signed: boolean, minutes: number, path: string, domain: string): this;
    make(name: string, value: any, signed: boolean, minutes: number, path: string, domain: string, secure: boolean): this;
    make(name: string, value: any, signed: boolean, minutes: number, path: string, domain: string, secure: boolean, httpOnly: boolean): this;
    make(name: string, value: any, options: SetCookieOptions): this;
    forever(name: string, value: any): this;
    forever(name: string, value: any, signed: boolean): this;
    forever(name: string, value: any, signed: boolean, path: string): this;
    forever(name: string, value: any, signed: boolean, path: string, domain: string): this;
    forever(name: string, value: any, signed: boolean, path: string, domain: string, secure: boolean): this;
    forever(name: string, value: any, signed: boolean, path: string, domain: string, secure: boolean, httpOnly: boolean): this;
    forever(name: string, value: any, options: SetCookieOptions): this;
}
