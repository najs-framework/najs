import { IContextualFacadeFactoryFullVerbs } from './interfaces/IFacadeGrammar'
import { ContextualFacade } from './ContextualFacade'

export class ContextualFacadeFactory<T extends ContextualFacade<Context>, Context = any>
  implements IContextualFacadeFactoryFullVerbs<T, Context> {
  contextualFacadeCreator: (context: Context) => T

  constructor(createContextualFacade: (context: Context) => T) {
    this.contextualFacadeCreator = createContextualFacade
  }

  of(context: Context): T {
    return this.contextualFacadeCreator(context)
  }

  with(context: Context): T {
    return this.contextualFacadeCreator(context)
  }

  for(context: Context): T {
    return this.contextualFacadeCreator(context)
  }

  at(context: Context): T {
    return this.contextualFacadeCreator(context)
  }

  from(context: Context): T {
    return this.contextualFacadeCreator(context)
  }
}
