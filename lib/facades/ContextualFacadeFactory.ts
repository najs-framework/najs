export abstract class ContextualFacadeFactory<Context = any> {
  protected abstract createContextualFacade(context: Context): any

  of(context: Context) {
    return this.createContextualFacade(context)
  }

  // with(context: Context) {
  //   return this.createContextualFacade(context)
  // }

  // for(context: Context) {
  //   return this.createContextualFacade(context)
  // }

  // at(context: Context) {
  //   return this.createContextualFacade(context)
  // }
}
