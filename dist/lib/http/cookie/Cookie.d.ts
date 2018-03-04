/// <reference types="express" />
import { IAutoload } from 'najs-binding';
import { ContextualFacade } from 'najs-facade';
import { Controller } from '../controller/Controller';
import { Response } from 'express';
export declare class Cookie extends ContextualFacade<Controller> implements IAutoload {
    protected data: Object;
    protected cookies: Object;
    protected signedCookies: Object;
    constructor(controller: Controller);
    getClassName(): string;
    protected getResponse(): Response;
}
