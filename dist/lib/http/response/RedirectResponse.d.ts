/// <reference path="../../contracts/HttpDriver.d.ts" />
/// <reference path="../../contracts/Response.d.ts" />
export declare class RedirectResponse implements Najs.Contracts.Response {
    static className: string;
    protected url: string;
    protected status: number;
    constructor(url: string, status?: number);
    getClassName(): string;
    respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>): void;
}
