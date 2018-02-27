import { Controller } from '../../http/controller/Controller';
export declare abstract class HandlebarsHelper {
    protected context: any;
    protected controller?: Controller;
    protected options: any;
    protected constructor(context: any);
    protected constructor(context: any, controller: Controller);
    abstract run(): any;
    isBlockHelper(): boolean;
    static create(helper: typeof HandlebarsHelper): Function;
    static create(helper: typeof HandlebarsHelper, controller: Controller): Function;
}
