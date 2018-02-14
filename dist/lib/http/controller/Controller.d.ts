/// <reference types="node" />
import { IAutoload } from '../../core/IAutoload';
import { IRequestRetriever } from '../request/IRequestRetriever';
import { IncomingMessage, ServerResponse } from 'http';
export declare abstract class Controller<Request extends IncomingMessage = IncomingMessage, Response extends ServerResponse = ServerResponse> implements IAutoload {
    request: Request;
    response: Response;
    input: IRequestRetriever;
    constructor(request: Request, response: Response);
    abstract getClassName(): string;
}
