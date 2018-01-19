import { IResponse } from './IResponse';
export declare class Response {
    static json(value: any): IResponse;
    static redirect(url: string, status: number): IResponse;
}
