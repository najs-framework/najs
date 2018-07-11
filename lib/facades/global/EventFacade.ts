/// <reference types="node" />

import '../../event/EventDispatcher'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../core/Najs'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../../constants'

const facade = Facade.create<NodeJS.EventEmitter>(<any>Najs, 'event', function() {
  return make<NodeJS.EventEmitter>(NajsClasses.Event.EventDispatcher)
})

export const Event: NodeJS.EventEmitter & IFacadeBase = facade
export const EventFacade: NodeJS.EventEmitter & IFacade = facade
