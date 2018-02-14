import { IContextualFacadeVerbOf } from '../interfaces/IFacadeGrammar'
import { ContextualFacadeFactory } from '../ContextualFacadeFactory'
import { ContextualFacade } from '../ContextualFacade'

export class InputFacade extends ContextualFacade {
  doSomething() {
    // console.log('do something with context', this.context)
  }
}

export class InputContextualFacadeFactory<Context extends any> extends ContextualFacadeFactory<Context> {
  protected createContextualFacade(context: Context) {
    return new InputFacade(context)
  }
}

export const InputContextualFacade: IContextualFacadeVerbOf<InputFacade, any> = new InputContextualFacadeFactory()
