/// <reference path="../../contracts/HttpDriver.d.ts" />
/// <reference path="../../contracts/Response.d.ts" />
export declare class JsonResponse implements Najs.Contracts.Response {
    static className: string;
    protected value: any;
    constructor(value: any);
    getClassName(): string;
    respond(request: any, response: any, driver: Najs.Contracts.HttpDriver<any, any>): void;
}
