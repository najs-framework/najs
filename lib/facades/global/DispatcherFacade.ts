import '../../../lib/event/EventDispatcher'
import { Facade } from '../Facade'
import { IFacade, IFacadeBase } from '../interfaces/IFacadeGrammar'
import { IDispatcher } from '../../../lib/event/IDispatcher'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

const facade = Facade.create<IDispatcher>(<any>Najs, 'event', function() {
  return make<IDispatcher>(GlobalFacade.Event)
})

export const Dispatcher: IDispatcher & IFacadeBase = facade
export const DispatcherFacade: IDispatcher & IFacade = facade
