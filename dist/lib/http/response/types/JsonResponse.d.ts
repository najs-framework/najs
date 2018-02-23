import { IResponse } from '../IResponse';
import { IHttpDriver } from '../../driver/IHttpDriver';
export declare class JsonResponse implements IResponse {
    protected value: any;
    constructor(value: any);
    respond(request: any, response: any, driver: IHttpDriver): void;
}
