import 'jest'
import * as Sinon from 'sinon'
import * as Middleware from '../../../../lib/http/middleware/built-ins/SessionMiddleware'
import { Session } from '../../../../lib/http/session/Session'
import { isPromise } from '../../../../lib/private/isPromise'
import { ViewResponse } from '../../../../lib/http/response/ViewResponse'
import { HandlebarsHelper } from '../../../../lib/view/handlebars/HandlebarsHelper'
import { HandlebarsViewResponse } from '../../../../lib/view/handlebars/HandlebarsViewResponse'
import { MemberProxy } from '../../../../lib/http/controller/MemberProxy'
import { ExpressMiddlewareBase } from '../../../../lib/http/middleware/ExpressMiddlewareBase'

describe('SessionMiddleware', function() {
  it('extends ExpressMiddlewareBase', function() {
    const middleware = new Middleware.SessionMiddleware('session')
    expect(middleware).toBeInstanceOf(ExpressMiddlewareBase)
  })

  it('implements IAutoload', function() {
    const middleware = new Middleware.SessionMiddleware('session')
    expect(middleware.getClassName()).toEqual(Middleware.SessionMiddleware.className)
  })

  it('has shared Express.RequestHandler called Session which not init by default', function() {
    expect(Middleware.Session).toBeUndefined()
  })

  describe('.createMiddleware()', function() {
    it('creates Session from "express-session" if Session is not found', function() {
      const makeStoreSpy = Sinon.spy(Middleware.SessionMiddleware.prototype, <any>'makeStore')
      const getOptionsSpy = Sinon.spy(Middleware.SessionMiddleware.prototype, <any>'getOptions')
      const instance = new Middleware.SessionMiddleware('session')
      instance.createMiddleware()
      expect(typeof Middleware.Session === 'function').toBe(true)
      expect(makeStoreSpy.called).toBe(true)
      expect(getOptionsSpy.called).toBe(true)
      makeStoreSpy.restore()
      getOptionsSpy.restore()
    })

    it('returns Session if it is exists', function() {
      const instance = new Middleware.SessionMiddleware('session')
      instance.createMiddleware()

      const makeStoreSpy = Sinon.spy(Middleware.SessionMiddleware.prototype, <any>'makeStore')
      const getOptionsSpy = Sinon.spy(Middleware.SessionMiddleware.prototype, <any>'getOptions')
      instance.createMiddleware()
      expect(makeStoreSpy.called).toBe(false)
      expect(getOptionsSpy.called).toBe(false)
      makeStoreSpy.restore()
      getOptionsSpy.restore()
    })
  })

  describe('.before()', function() {
    it('use SessionContextualFacade to create a session in controller', function() {
      const instance = new Middleware.SessionMiddleware('session')
      const controller = {}
      instance.before(<any>{}, <any>{}, <any>controller)
      expect(controller['session']).toBeInstanceOf(Session)
    })

    it('replaces an instance session in controller if it is MemberProxy instance', function() {
      const instance = new Middleware.SessionMiddleware('session')
      const controller = {
        session: new MemberProxy('test', {})
      }
      instance.before(<any>{}, <any>{}, <any>controller)
      expect(controller['session']).toBeInstanceOf(Session)
    })
  })

  describe('.after()', function() {
    it('returns a promise', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = {}
      const instance = new Middleware.SessionMiddleware('session')

      const returnValue = instance.after(<any>request, <any>response, result, <any>controller)
      expect(isPromise(returnValue)).toBe(true)
    })

    it('does nothing if the view is ViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new ViewResponse('test')
      const instance = new Middleware.SessionMiddleware('session')

      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(returnValue === result).toBe(true)
    })

    it('calls result.helper and add "Session" helper if the view is HandlebarsViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new HandlebarsViewResponse('test')

      const helper = () => {}
      const createHelperStub = Sinon.stub(HandlebarsHelper, 'create')
      createHelperStub.returns(helper)

      const instance = new Middleware.SessionMiddleware('session')

      expect(result.getVariables()).toEqual({})
      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(result.getVariables()).toEqual({ helpers: { Session: helper } })
      expect(returnValue === result).toBe(true)
      createHelperStub.restore()
    })
  })
})
