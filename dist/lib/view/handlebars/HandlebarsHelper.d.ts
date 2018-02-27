import { Controller } from '../../http/controller/Controller';
export declare abstract class HandlebarsHelper {
    protected context: any;
    protected controller: Controller;
    protected options: any;
    constructor(context: any, controller: Controller);
    abstract run(): any;
    isBlockHelper(): boolean;
    static create(name: string, controller: Controller, helper: typeof HandlebarsHelper): any;
}
