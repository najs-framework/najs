import { IResponse } from '../IResponse';
import { IHttpDriver } from '../IHttpDriver';
export declare class RedirectResponse implements IResponse {
    private url;
    private status;
    constructor(url: string, status?: number);
    respond(response: any, driver: IHttpDriver): void;
}
