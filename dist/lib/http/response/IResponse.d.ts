import { IHttpDriver } from '../driver/IHttpDriver';
export interface IResponse {
    respond(response: any, driver: IHttpDriver): void;
}
