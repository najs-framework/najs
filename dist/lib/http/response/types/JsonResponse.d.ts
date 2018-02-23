import { IAutoload } from 'najs-binding';
import { IResponse } from '../IResponse';
import { IHttpDriver } from '../../driver/IHttpDriver';
export declare class JsonResponse implements IResponse, IAutoload {
    static className: string;
    protected value: any;
    constructor(value: any);
    getClassName(): string;
    respond(request: any, response: any, driver: IHttpDriver): void;
}
