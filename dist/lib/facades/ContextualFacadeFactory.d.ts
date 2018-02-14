export declare abstract class ContextualFacadeFactory<Context = any> {
    protected abstract createContextualFacade(context: Context): any;
    of(context: Context): any;
}
