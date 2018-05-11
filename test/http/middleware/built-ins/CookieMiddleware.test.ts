import 'jest'
import * as Sinon from 'sinon'
import * as Middleware from '../../../../lib/http/middleware/built-ins/CookieMiddleware'
import { isPromise } from '../../../../lib/private/isPromise'
import { ViewResponse } from '../../../../lib/http/response/ViewResponse'
import { HandlebarsHelper } from '../../../../lib/view/handlebars/HandlebarsHelper'
import { HandlebarsViewResponse } from '../../../../lib/view/handlebars/HandlebarsViewResponse'
import { Cookie } from '../../../../lib/http/cookie/Cookie'
import { MemberProxy } from '../../../../lib/http/controller/MemberProxy'
import { ExpressMiddlewareBase } from '../../../../lib/http/middleware/ExpressMiddlewareBase'

describe('CookieMiddleware', function() {
  it('extends ExpressMiddlewareBase', function() {
    const middleware = new Middleware.CookieMiddleware('cookie')
    expect(middleware).toBeInstanceOf(ExpressMiddlewareBase)
  })

  it('implements IAutoload', function() {
    const middleware = new Middleware.CookieMiddleware('cookie')
    expect(middleware.getClassName()).toEqual(Middleware.CookieMiddleware.className)
  })

  it('has shared Express.RequestHandler called CookieParser which not init by default', function() {
    expect(Middleware.CookieParser).toBeUndefined()
  })

  describe('.createMiddleware()', function() {
    it('creates Cookie from "cookie-parser" if Cookie is not found', function() {
      const getSecretSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, <any>'getSecret')
      const getOptionsSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, <any>'getOptions')
      const instance = new Middleware.CookieMiddleware('cookie')
      instance.createMiddleware()
      expect(typeof Middleware.CookieParser === 'function').toBe(true)
      expect(getSecretSpy.called).toBe(true)
      expect(getOptionsSpy.called).toBe(true)
      getSecretSpy.restore()
      getOptionsSpy.restore()
    })

    it('returns CookieParser if it is exists', function() {
      const instance = new Middleware.CookieMiddleware('cookie')
      instance.createMiddleware()

      const getSecretSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, <any>'getSecret')
      const getOptionsSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, <any>'getOptions')
      instance.createMiddleware()
      expect(getSecretSpy.called).toBe(false)
      expect(getOptionsSpy.called).toBe(false)
      getSecretSpy.restore()
      getOptionsSpy.restore()
    })
  })

  describe('.before()', function() {
    it('use CookieContextualFacade to create a cookie in controller', function() {
      const instance = new Middleware.CookieMiddleware('cookie')
      const controller = {}
      instance.before(<any>{}, <any>{}, <any>controller)
      expect(controller['cookie']).toBeInstanceOf(Cookie)
    })

    it('replaces an instance cookie in controller if it is MemberProxy instance', function() {
      const instance = new Middleware.CookieMiddleware('cookie')
      const controller = {
        cookie: new MemberProxy('test', {})
      }
      instance.before(<any>{}, <any>{}, <any>controller)
      expect(controller['cookie']).toBeInstanceOf(Cookie)
    })
  })

  describe('.after()', function() {
    it('returns a promise', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = {}
      const instance = new Middleware.CookieMiddleware('cookie')

      const returnValue = instance.after(<any>request, <any>response, result, <any>controller)
      expect(isPromise(returnValue)).toBe(true)
    })

    it('does nothing if the view is ViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new ViewResponse('test')
      const instance = new Middleware.CookieMiddleware('cookie')

      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(returnValue === result).toBe(true)
    })

    it('calls result.helper and add "Cookie" helper if the view is HandlebarsViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new HandlebarsViewResponse('test')

      const helper = () => {}
      const createHelperStub = Sinon.stub(HandlebarsHelper, 'create')
      createHelperStub.returns(helper)

      const instance = new Middleware.CookieMiddleware('cookie')

      expect(result.getVariables()).toEqual({})
      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(result.getVariables()).toEqual({ helpers: { Cookie: helper } })
      expect(returnValue === result).toBe(true)
      createHelperStub.restore()
    })
  })
})
