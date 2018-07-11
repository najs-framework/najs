/// <reference path="../../contracts/Dispatcher.ts" />

import '../../event/EventDispatcher'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../core/Najs'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../../constants'

const facade = Facade.create<Najs.Contracts.Dispatcher>(<any>Najs, 'event', function() {
  return make<Najs.Contracts.Dispatcher>(NajsClasses.Event.EventDispatcher)
})

export const Dispatcher: Najs.Contracts.Dispatcher & IFacadeBase = facade
export const DispatcherFacade: Najs.Contracts.Dispatcher & IFacade = facade
