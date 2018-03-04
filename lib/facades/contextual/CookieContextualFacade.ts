import '../../http/cookie/Cookie'
import { make } from 'najs-binding'
import { Facade } from 'najs-facade'
import { IContextualFacadeVerbOf } from 'najs-facade'
import { Cookie as CookieClass } from '../../http/cookie/Cookie'
import { Controller } from '../../http/controller/Controller'
import { ContextualFacadeClass } from '../../constants'

const facade = Facade.create<CookieClass, Controller>(function(context: Controller) {
  if (!context.cookie) {
    return make<CookieClass>(ContextualFacadeClass.Cookie, [context])
  }
  return <CookieClass>context.cookie
})

export const Cookie: IContextualFacadeVerbOf<CookieClass, Controller> = facade
export const CookieContextualFacade: IContextualFacadeVerbOf<CookieClass, Controller> = facade
