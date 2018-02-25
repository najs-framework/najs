import '../../http/session/Session'
import { make } from 'najs-binding'
import { Facade } from 'najs-facade'
import { IContextualFacadeVerbOf } from 'najs-facade'
import { Session as SessionClass } from '../../http/session/Session'
import { Controller } from '../../http/controller/Controller'
import { ContextualFacadeClass } from '../../constants'

const facade = Facade.create<SessionClass, Controller>(function(context: Controller) {
  if (!context.session) {
    return make<SessionClass>(ContextualFacadeClass.Session, [context])
  }
  return <SessionClass>context.session
})

export const Session: IContextualFacadeVerbOf<SessionClass, Controller> = facade
export const SessionContextualFacade: IContextualFacadeVerbOf<SessionClass, Controller> = facade
