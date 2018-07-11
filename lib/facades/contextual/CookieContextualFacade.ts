import '../../http/cookie/Cookie'
import { make } from 'najs-binding'
import { Facade } from 'najs-facade'
import { IContextualFacadeVerbOf } from 'najs-facade'
import { Cookie as CookieClass } from '../../http/cookie/Cookie'
import { Controller } from '../../http/controller/Controller'
import { Najs } from '../../constants'
import { MemberProxy } from '../../http/controller/MemberProxy'

const facade = Facade.create<CookieClass, Controller>(function(context: Controller) {
  if (!context.cookie || context.cookie instanceof MemberProxy) {
    return make<CookieClass>(Najs.Http.Cookie, [context])
  }
  return <CookieClass>context.cookie
})

export const Cookie: IContextualFacadeVerbOf<CookieClass, Controller> = facade
export const CookieContextualFacade: IContextualFacadeVerbOf<CookieClass, Controller> = facade
