/// <reference types="node" />
import { IAutoload } from '../../core/IAutoload';
import { IncomingMessage, ServerResponse } from 'http';
export declare abstract class Controller<Request extends IncomingMessage = IncomingMessage, Response extends ServerResponse = ServerResponse> implements IAutoload {
    protected request: Request;
    protected response: Response;
    constructor(request: Request, response: Response);
    abstract getClassName(): string;
}
