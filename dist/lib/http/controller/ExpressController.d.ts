/// <reference types="express" />
import { IAutoloadMetadata } from 'najs-binding';
import { Controller } from './Controller';
import { IRequestRetriever } from '../request/IRequestRetriever';
import { Request, Response } from 'express';
export declare type RequestIdAutoloadMetadata = {
    readonly requestId: string;
};
export declare abstract class ExpressController extends Controller<Request, Response> implements IAutoloadMetadata<RequestIdAutoloadMetadata> {
    __autoloadMetadata: RequestIdAutoloadMetadata;
    protected body: IRequestRetriever;
    protected query: IRequestRetriever;
    protected params: IRequestRetriever;
    constructor(request: Request, response: Response);
}
