import { IHttpDriver } from '../IHttpDriver';
export interface IResponse {
    respond(response: any, driver: IHttpDriver): void;
}
