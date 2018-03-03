import '../../auth/AuthManager'
import { make } from 'najs-binding'
import { Facade } from 'najs-facade'
import { IContextualFacadeVerbOf, IContextualFacadeVerbFrom } from 'najs-facade'
import { AuthManager } from '../../auth/AuthManager'
import { Controller } from '../../http/controller/Controller'
import { ContextualFacadeClass } from '../../constants'

const facade = Facade.create<AuthManager, Controller>(function(context: Controller) {
  if (!context.auth) {
    return make<AuthManager>(ContextualFacadeClass.Auth, [context])
  }
  return <AuthManager>context.auth
})

export const Auth: IContextualFacadeVerbOf<AuthManager, Controller> &
  IContextualFacadeVerbFrom<AuthManager, Controller> = facade
export const AuthContextualFacade: IContextualFacadeVerbOf<AuthManager, Controller> &
  IContextualFacadeVerbFrom<AuthManager, Controller> = facade
