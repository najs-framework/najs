import { IAutoload } from 'najs-binding';
import { IResponse } from '../IResponse';
import { IHttpDriver } from '../../driver/IHttpDriver';
export declare class BackResponse implements IResponse, IAutoload {
    static className: string;
    protected defaultUrl: string;
    constructor(defaultUrl?: string);
    getClassName(): string;
    respond(request: any, response: any, driver: IHttpDriver): void;
}
