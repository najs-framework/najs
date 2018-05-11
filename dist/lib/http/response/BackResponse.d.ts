/// <reference path="../../contracts/HttpDriver.d.ts" />
/// <reference path="../../contracts/Response.d.ts" />
/// <reference path="../../contracts/types/http.d.ts" />
export declare class BackResponse implements Najs.Contracts.Response {
    static className: string;
    protected defaultUrl: string;
    constructor(defaultUrl?: string);
    getClassName(): string;
    respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>): void;
}
