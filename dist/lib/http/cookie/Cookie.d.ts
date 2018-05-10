/// <reference path="../../contracts/Cookie.d.ts" />
/// <reference types="express" />
import { ContextualFacade } from 'najs-facade';
import { Controller } from '../controller/Controller';
import { Response } from 'express';
export declare class Cookie extends ContextualFacade<Controller> implements Najs.Contracts.Cookie {
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
    exists(path: string): boolean;
    exists(path: string, signed: boolean): boolean;
    all(): Object;
    all(signed: boolean): Object;
    only(path: string): Object;
    only(paths: string[]): Object;
    only(...args: Array<string | string[]>): Object;
    except(path: string): Object;
    except(paths: string[]): Object;
    except(...args: Array<string | string[]>): Object;
    forget(name: string): this;
    forget(name: string, path: string): this;
    forget(name: string, path: string, domain: string): this;
    forget(name: string, options: Najs.Http.CookieOptions): this;
    make(name: string, value: any): this;
    make(name: string, value: any, signed: boolean): this;
    make(name: string, value: any, signed: boolean, minutes: number): this;
    make(name: string, value: any, signed: boolean, minutes: number, path: string): this;
    make(name: string, value: any, signed: boolean, minutes: number, path: string, domain: string): this;
    make(name: string, value: any, signed: boolean, minutes: number, path: string, domain: string, secure: boolean): this;
    make(name: string, value: any, signed: boolean, minutes: number, path: string, domain: string, secure: boolean, httpOnly: boolean): this;
    make(name: string, value: any, options: Najs.Http.CookieOptions): this;
    forever(name: string, value: any): this;
    forever(name: string, value: any, signed: boolean): this;
    forever(name: string, value: any, signed: boolean, path: string): this;
    forever(name: string, value: any, signed: boolean, path: string, domain: string): this;
    forever(name: string, value: any, signed: boolean, path: string, domain: string, secure: boolean): this;
    forever(name: string, value: any, signed: boolean, path: string, domain: string, secure: boolean, httpOnly: boolean): this;
    forever(name: string, value: any, options: Najs.Http.CookieOptions): this;
}
