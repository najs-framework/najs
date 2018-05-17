/// <reference path="../../contracts/Dispatcher.ts" />

import '../../../lib/event/EventDispatcher'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<Najs.Contracts.Dispatcher>(<any>Najs, 'event', function() {
  return make<Najs.Contracts.Dispatcher>(GlobalFacadeClass.Event)
})

export const Dispatcher: Najs.Contracts.Dispatcher & IFacadeBase = facade
export const DispatcherFacade: Najs.Contracts.Dispatcher & IFacade = facade
