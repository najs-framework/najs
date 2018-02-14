import { IContextualFacadeFactoryFullVerbs } from './interfaces/IFacadeGrammar';
import { ContextualFacade } from './ContextualFacade';
export declare class ContextualFacadeFactory<T extends ContextualFacade<Context>, Context = any> implements IContextualFacadeFactoryFullVerbs<T, Context> {
    contextualFacadeCreator: (context: Context) => T;
    constructor(createContextualFacade: (context: Context) => T);
    of(context: Context): T;
    with(context: Context): T;
    for(context: Context): T;
    at(context: Context): T;
    from(context: Context): T;
}
