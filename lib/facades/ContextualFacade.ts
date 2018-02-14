import { Facade } from './Facade'
import { IContextualFacade } from './interfaces/IFacadeGrammar'

export abstract class ContextualFacade<Context = any> extends Facade implements IContextualFacade<Context> {
  context: Context

  constructor(context: Context) {
    super()
    this.context = context
  }
}
