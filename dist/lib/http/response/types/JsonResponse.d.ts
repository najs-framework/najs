import { IResponse } from '../IResponse';
import { IHttpDriver } from '../../driver/IHttpDriver';
export declare class JsonResponse implements IResponse {
    protected value: any;
    constructor(value: any);
    respond(response: any, driver: IHttpDriver): void;
}
