import { Controller } from '../../http/controller/Controller';
export declare abstract class HandlebarsHelper<Context extends Object = {}, Ctrl extends Controller = Controller> {
    protected context: Context;
    protected controller?: Ctrl;
    protected options: any;
    protected constructor(context: Context);
    protected constructor(context: Context, controller: Ctrl);
    abstract run(...args: any[]): any;
    isBlockHelper(): boolean;
    renderChildren(blockParams: any[]): any;
    static create(helper: typeof HandlebarsHelper): Function;
    static create(helper: typeof HandlebarsHelper, controller: Controller): Function;
}
