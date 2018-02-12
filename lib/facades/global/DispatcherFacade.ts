import '../../../lib/event/EventDispatcher'
import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { IDispatcher } from '../../../lib/event/IDispatcher'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

export const DispatcherFacade: IDispatcher & IFacade = Facade.create<IDispatcher>(Najs, 'event', function() {
  return make<IDispatcher>(GlobalFacade.Event)
})
