/// <reference path="../../contracts/Cookie.d.ts" />
/// <reference types="express" />
import { ContextualFacade } from 'najs-facade';
import { Controller } from '../controller/Controller';
import { Response } from 'express';
export interface Cookie extends Najs.Contracts.Cookie {
}
export declare class Cookie extends ContextualFacade<Controller> implements Najs.Contracts.Cookie {
    protected data: Object;
    protected cookies: Object;
    protected signedCookies: Object;
    constructor(controller: Controller);
    getClassName(): string;
    protected getResponse(): Response;
    isSigned(...args: Array<string | string[]>): boolean;
    has(path: string, signed?: boolean): boolean;
    exists(path: string, signed?: boolean): boolean;
    all(signed?: boolean): Object;
    forget(name: string, arg1?: Najs.Http.CookieOptions | string, arg2?: string): this;
    make(name: string, value: any, optionsOrSigned?: boolean | Najs.Http.CookieOptions, minutes?: number, path?: string | undefined, domain?: string | undefined, secure?: boolean | undefined, httpOnly?: boolean | undefined): this;
    forever(name: string, value: any, optionsOrSigned?: boolean | Najs.Http.CookieOptions, path?: string | undefined, domain?: string | undefined, secure?: boolean | undefined, httpOnly?: boolean | undefined): this;
}
