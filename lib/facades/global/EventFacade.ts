/// <reference types="node" />

import '../../../lib/event/EventDispatcher'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<NodeJS.EventEmitter>(<any>Najs, 'event', function() {
  return make<NodeJS.EventEmitter>(GlobalFacadeClass.Event)
})

export const Event: NodeJS.EventEmitter & IFacadeBase = facade
export const EventFacade: NodeJS.EventEmitter & IFacade = facade
