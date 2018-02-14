import { Facade } from '../Facade'
import { ContextualFacade } from '../ContextualFacade'
import { IContextualFacadeVerbOf } from '../interfaces/IFacadeGrammar'

export class InputFacade extends ContextualFacade {
  doSomething() {
    // console.log('do something with context', this.context)
  }
}

const facade = Facade.create<InputFacade, any>(function(context: any) {
  return new InputFacade(context)
})
export const InputContextualFacade: IContextualFacadeVerbOf<InputFacade, any> = facade
