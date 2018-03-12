import '../../session/ExpressSessionMemoryStore'
import { make, IAutoload } from 'najs-binding'
import { SystemClass, ConfigurationKeys } from '../../../constants'
import { register } from 'najs-binding'
import { ExpressController } from '../../controller/ExpressController'
import { HandlebarsViewResponse } from '../../../view/handlebars/HandlebarsViewResponse'
import { HandlebarsHelper } from '../../../view/handlebars/HandlebarsHelper'
import { SessionHandlebarsHelper } from '../../../view/handlebars/helpers/SessionHandlebarsHelper'
import { ConfigFacade } from '../../../facades/global/ConfigFacade'
import { Controller } from '../../../http/controller/Controller'
import { SessionContextualFacade } from '../../../facades/contextual/SessionContextualFacade'
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase'
import * as ExpressSession from 'express-session'
import * as Express from 'express'

export let Session: Express.RequestHandler

export class SessionMiddleware extends ExpressMiddlewareBase implements IAutoload {
  static className: string = 'Najs.SessionMiddleware'

  getClassName() {
    return SessionMiddleware.className
  }

  createMiddleware(): Express.Handler | Express.Handler[] | undefined {
    if (!Session) {
      Session = ExpressSession(Object.assign({}, { store: this.makeStore() }, this.getOptions()))
    }
    return Session
  }

  protected makeStore(): any {
    return make(SystemClass.ExpressSessionStore)
  }

  protected getOptions(): any {
    return ConfigFacade.get(ConfigurationKeys.Session, {
      secret: 'najs',
      resave: false,
      unset: 'destroy',
      saveUninitialized: true
    })
  }

  before(request: Express.Request, response: Express.Response, controller: Controller) {
    SessionContextualFacade.of(controller)
  }

  async after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController) {
    if (result instanceof HandlebarsViewResponse) {
      result.helper('Session', HandlebarsHelper.create(SessionHandlebarsHelper, controller))
    }
    return result
  }
}
register(SessionMiddleware)
