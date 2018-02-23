import { IAutoload } from '../../../core/IAutoload';
import { IResponse } from '../IResponse';
import { IHttpDriver } from '../../driver/IHttpDriver';
export declare class RedirectResponse implements IResponse, IAutoload {
    static className: string;
    protected url: string;
    protected status: number;
    constructor(url: string, status?: number);
    getClassName(): string;
    respond(request: any, response: any, driver: IHttpDriver): void;
}
