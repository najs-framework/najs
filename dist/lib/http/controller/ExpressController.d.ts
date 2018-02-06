/// <reference types="express" />
import { Controller } from './Controller';
import { IRequestRetriever } from '../request/IRequestRetriever';
import { Request, Response } from 'express';
export declare abstract class ExpressController extends Controller<Request, Response> {
    protected body: IRequestRetriever;
    protected query: IRequestRetriever;
    protected params: IRequestRetriever;
    constructor(request: Request, response: Response);
    protected createInputFromRequest(): IRequestRetriever;
}
