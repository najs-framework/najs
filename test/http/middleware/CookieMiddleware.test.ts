import 'jest'
import * as Sinon from 'sinon'
import * as Middleware from '../../../lib/http/middleware/CookieMiddleware'
import { make } from 'najs-binding'
import { isPromise } from '../../../lib/private/isPromise'
import { ViewResponse } from '../../../lib/http/response/types/ViewResponse'
import { HandlebarsHelper } from '../../../lib/view/handlebars/HandlebarsHelper'
import { HandlebarsViewResponse } from '../../../lib/view/handlebars/HandlebarsViewResponse'

describe('CookieMiddleware', function() {
  it('is fit for najs-binding', function() {
    expect(Middleware.CookieMiddleware.className).toEqual('Najs.CookieMiddleware')
  })

  it('has shared Express.RequestHandler called CookieParser which not init by default', function() {
    expect(Middleware.CookieParser).toBeUndefined()
  })

  it('creates CookieParser from "cookie-parser" module with secret = "najs" by default when constructor called', function() {
    const getSecretSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, <any>'getSecret')
    const getOptionsSpy = Sinon.spy(Middleware.CookieMiddleware.prototype, <any>'getOptions')
    make(Middleware.CookieMiddleware.className)
    expect(typeof Middleware.CookieParser === 'function').toBe(true)
    expect(getSecretSpy.called).toBe(true)
    expect(getOptionsSpy.called).toBe(true)
    getSecretSpy.restore()
    getOptionsSpy.restore()
  })

  describe('.before()', function() {
    it('returns a promise, which calls CookieParser with request, response and fake next function', async function() {
      const request = {}
      const response = {}
      const instance = new Middleware.CookieMiddleware()

      function fakeCookieParser(request: any, response: any, done: any) {
        done()
      }

      const cookieParserStub = Sinon.stub(Middleware, 'CookieParser')
      cookieParserStub.callsFake(fakeCookieParser)

      const result = instance.before(<any>request, <any>response)

      expect(isPromise(result)).toBe(true)
      expect(cookieParserStub.firstCall.args[0] === request).toBe(true)
      expect(cookieParserStub.firstCall.args[1] === response).toBe(true)
      expect(typeof cookieParserStub.firstCall.args[2] === 'function').toBe(true)
      cookieParserStub.restore()
    })

    it('sets promise to Rejected if there is an error', async function() {
      const instance = new Middleware.CookieMiddleware()

      function fakeCookieParser(request: any, response: any, done: any) {
        done(new Error('Test'))
      }

      const cookieParserStub = Sinon.stub(Middleware, 'CookieParser')
      cookieParserStub.callsFake(fakeCookieParser)
      try {
        await instance.before(<any>{}, <any>{})
      } catch (error) {
        expect(error.message).toEqual('Test')
        cookieParserStub.restore()
        return
      }
      expect('should not reach this line').toEqual('hmm')
    })
  })

  describe('.after()', function() {
    it('returns a promise', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = {}
      const instance = new Middleware.CookieMiddleware()

      const returnValue = instance.after(<any>request, <any>response, result, <any>controller)
      expect(isPromise(returnValue)).toBe(true)
    })

    it('does nothing if the view is ViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new ViewResponse('test')
      const instance = new Middleware.CookieMiddleware()

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

      const instance = new Middleware.CookieMiddleware()

      expect(result.getVariables()).toEqual({})
      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(result.getVariables()).toEqual({ helpers: { Cookie: helper } })
      expect(returnValue === result).toBe(true)
      createHelperStub.restore()
    })
  })
})
