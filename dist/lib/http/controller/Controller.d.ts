/// <reference path="../../contracts/types/http.d.ts" />
/// <reference path="../../contracts/Cookie.d.ts" />
import { ISession } from '../session/ISession';
import { IAuth } from '../../auth/interfaces/IAuth';
import { IncomingMessage, ServerResponse } from 'http';
export declare abstract class Controller implements Najs.Http.IController {
    request: IncomingMessage;
    response: ServerResponse;
    input: Najs.Http.IRequestDataReader;
    auth: IAuth;
    session: ISession;
    cookie: Najs.Contracts.Cookie;
    constructor(request: IncomingMessage, response: ServerResponse);
    abstract getClassName(): string;
}
