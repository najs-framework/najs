/// <reference path="../../contracts/types/http.d.ts" />
/// <reference path="../../contracts/Cookie.d.ts" />
import { IRequestDataReader } from '../request/IRequestDataReader';
import { ISession } from '../session/ISession';
import { IAuth } from '../../auth/interfaces/IAuth';
import { IncomingMessage, ServerResponse } from 'http';
export declare abstract class Controller<Request extends IncomingMessage = IncomingMessage, Response extends ServerResponse = ServerResponse> implements Najs.Http.IController {
    request: Request;
    response: Response;
    input: IRequestDataReader;
    auth: IAuth;
    session: ISession;
    cookie: Najs.Contracts.Cookie;
    constructor(request: Request, response: Response);
    abstract getClassName(): string;
}
