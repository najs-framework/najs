import '../../../lib/event/EventDispatcher'
import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { IEventEmitter } from '../../../lib/event/IEventEmitter'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

export const EventFacade: IEventEmitter & IFacade = Facade.create<IEventEmitter>(<any>Najs, 'event', function() {
  return make<IEventEmitter>(GlobalFacade.Event)
})
