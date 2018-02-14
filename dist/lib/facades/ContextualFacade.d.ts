import { Facade } from './Facade';
export declare abstract class ContextualFacade<Context = any> extends Facade {
    context: Context;
    constructor(context: Context);
}
