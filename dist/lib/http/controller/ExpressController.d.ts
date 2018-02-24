/// <reference types="express" />
import { IAutoloadMetadata } from 'najs-binding';
import { Controller } from './Controller';
import { IRequestDataReader } from '../request/IRequestDataReader';
import { Request, Response } from 'express';
export declare type RequestIdAutoloadMetadata = {
    readonly requestId: string;
};
export declare abstract class ExpressController extends Controller<Request, Response> implements IAutoloadMetadata<RequestIdAutoloadMetadata> {
    __autoloadMetadata: RequestIdAutoloadMetadata;
    protected body: IRequestDataReader;
    protected query: IRequestDataReader;
    protected params: IRequestDataReader;
    constructor(request: Request, response: Response);
}
