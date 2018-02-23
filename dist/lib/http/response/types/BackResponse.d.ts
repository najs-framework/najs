import { IResponse } from '../IResponse';
import { IHttpDriver } from '../../driver/IHttpDriver';
export declare class BackResponse implements IResponse {
    protected defaultUrl: string;
    constructor(defaultUrl?: string);
    respond(request: any, response: any, driver: IHttpDriver): void;
}
