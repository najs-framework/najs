/// <reference types="node" />
import { IAutoload } from 'najs-binding';
import { IRequestDataReader } from '../request/IRequestDataReader';
import { ISession } from '../session/ISession';
import { IAuth } from '../../auth/interfaces/IAuth';
import { IncomingMessage, ServerResponse } from 'http';
export declare abstract class Controller<Request extends IncomingMessage = IncomingMessage, Response extends ServerResponse = ServerResponse> implements IAutoload {
    request: Request;
    response: Response;
    input: IRequestDataReader;
    auth: IAuth;
    session: ISession;
    constructor(request: Request, response: Response);
    abstract getClassName(): string;
}
