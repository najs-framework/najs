import '../../http/request/RequestInput'
import { make } from 'najs-binding'
import { Facade } from '../Facade'
import { IContextualFacadeVerbOf, IContextualFacadeVerbFrom } from '../interfaces/IFacadeGrammar'
import { RequestInput } from '../../http/request/RequestInput'
import { Controller } from '../../http/controller/Controller'
import { ContextualFacadeClass } from '../../constants'

const facade = Facade.create<RequestInput, Controller>(function(context: Controller) {
  if (!context.input) {
    return make<RequestInput>(ContextualFacadeClass.Input, [context])
  }
  return <RequestInput>context.input
})

export const Input: IContextualFacadeVerbOf<RequestInput, Controller> &
  IContextualFacadeVerbFrom<RequestInput, Controller> = facade
export const InputContextualFacade: IContextualFacadeVerbOf<RequestInput, Controller> &
  IContextualFacadeVerbFrom<RequestInput, Controller> = facade
