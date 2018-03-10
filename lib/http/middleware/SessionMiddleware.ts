import '../session/ExpressSessionMemoryStore'
import { make } from 'najs-binding'
import { SystemClass } from '../../constants'
import { IExpressMiddleware } from './IExpressMiddleware'
import { register } from 'najs-binding'
import { ExpressController } from '../controller/ExpressController'
import { HandlebarsViewResponse } from '../../view/handlebars/HandlebarsViewResponse'
import { HandlebarsHelper } from '../../view/handlebars/HandlebarsHelper'
import { SessionHandlebarsHelper } from '../../view/handlebars/helpers/SessionHandlebarsHelper'
import { ConfigFacade } from '../../facades/global/ConfigFacade'
import { ConfigurationKeys } from '../../constants'
import * as ExpressSession from 'express-session'
import * as Express from 'express'
import { Controller } from '../../http/controller/Controller'
import { SessionContextualFacade } from './../../facades/contextual/SessionContextualFacade'

export let Session: Express.RequestHandler

export class SessionMiddleware implements IExpressMiddleware {
  static className: string = 'Najs.SessionMiddleware'

  constructor() {
    if (!Session) {
      Session = ExpressSession(
        Object.assign(
          {},
          {
            store: this.makeStore()
          },
          this.getOptions()
        )
      )
    }
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
    return new Promise(function(resolve: any, reject: any) {
      Session(request, response, function(error: any) {
        if (error) {
          return reject(error)
        }
        SessionContextualFacade.of(controller)
        return resolve()
      })
    })
  }

  async after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController) {
    if (result instanceof HandlebarsViewResponse) {
      result.helper('Session', HandlebarsHelper.create(SessionHandlebarsHelper, controller))
    }
    return result
  }
}
register(SessionMiddleware)
