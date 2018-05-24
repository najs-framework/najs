/// <reference path="../../contracts/types/http.d.ts" />
/// <reference types="express" />
import { Controller } from './Controller';
import { Request, Response } from 'express';
export declare type RequestIdAutoloadMetadata = {
    readonly requestId: string;
};
export declare abstract class ExpressController extends Controller {
    __autoloadMetadata: RequestIdAutoloadMetadata;
    protected body: Najs.Http.IRequestDataReader;
    protected query: Najs.Http.IRequestDataReader;
    protected params: Najs.Http.IRequestDataReader;
    request: Request;
    response: Response;
    constructor(request: Request, response: Response);
}
