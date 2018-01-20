import { IResponse } from '../IResponse';
import { IHttpDriver } from '../../driver/IHttpDriver';
export declare class RedirectResponse implements IResponse {
    private url;
    private status;
    constructor(url: string, status?: number);
    respond(response: any, driver: IHttpDriver): void;
}
