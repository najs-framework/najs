import { Facade } from './Facade'

export abstract class ContextualFacade<Context = any> extends Facade {
  context: Context

  constructor(context: Context) {
    super()
    this.context = context
  }
}
