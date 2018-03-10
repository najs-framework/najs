import 'jest'
import * as Sinon from 'sinon'
import * as Middleware from '../../../lib/http/middleware/SessionMiddleware'
import { make } from 'najs-binding'
import { isPromise } from '../../../lib/private/isPromise'
import { ViewResponse } from '../../../lib/http/response/types/ViewResponse'
import { HandlebarsHelper } from '../../../lib/view/handlebars/HandlebarsHelper'
import { HandlebarsViewResponse } from '../../../lib/view/handlebars/HandlebarsViewResponse'

describe('SessionMiddleware', function() {
  it('is fit for najs-binding', function() {
    expect(Middleware.SessionMiddleware.className).toEqual('Najs.SessionMiddleware')
  })

  it('has shared Express.RequestHandler called Session which not init by default', function() {
    expect(Middleware.Session).toBeUndefined()
  })

  it('creates Session from "express-session" module when constructor called', function() {
    const makeStoreSpy = Sinon.spy(Middleware.SessionMiddleware.prototype, <any>'makeStore')
    const getOptionsSpy = Sinon.spy(Middleware.SessionMiddleware.prototype, <any>'getOptions')
    make(Middleware.SessionMiddleware.className)
    expect(typeof Middleware.Session === 'function').toBe(true)
    expect(makeStoreSpy.called).toBe(true)
    expect(getOptionsSpy.called).toBe(true)
    makeStoreSpy.restore()
    getOptionsSpy.restore()
  })

  describe('.before()', function() {
    it('returns a promise, which calls CookieParser with request, response and fake next function', async function() {
      const request = {}
      const response = {}
      const instance = new Middleware.SessionMiddleware()

      function fakeSession(request: any, response: any, done: any) {
        done()
      }

      const sessionStub = Sinon.stub(Middleware, 'Session')
      sessionStub.callsFake(fakeSession)

      const result = instance.before(<any>request, <any>response, <any>{})

      expect(isPromise(result)).toBe(true)
      expect(sessionStub.firstCall.args[0] === request).toBe(true)
      expect(sessionStub.firstCall.args[1] === response).toBe(true)
      expect(typeof sessionStub.firstCall.args[2] === 'function').toBe(true)
      sessionStub.restore()
    })

    it('sets promise to Rejected if there is an error', async function() {
      const instance = new Middleware.SessionMiddleware()

      function fakeSession(request: any, response: any, done: any) {
        done(new Error('Test'))
      }

      const sessionStub = Sinon.stub(Middleware, 'Session')
      sessionStub.callsFake(fakeSession)
      try {
        await instance.before(<any>{}, <any>{}, <any>{})
      } catch (error) {
        expect(error.message).toEqual('Test')
        sessionStub.restore()
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
      const instance = new Middleware.SessionMiddleware()

      const returnValue = instance.after(<any>request, <any>response, result, <any>controller)
      expect(isPromise(returnValue)).toBe(true)
    })

    it('does nothing if the view is ViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new ViewResponse('test')
      const instance = new Middleware.SessionMiddleware()

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

      const instance = new Middleware.SessionMiddleware()

      expect(result.getVariables()).toEqual({})
      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(result.getVariables()).toEqual({ helpers: { Session: helper } })
      expect(returnValue === result).toBe(true)
      createHelperStub.restore()
    })
  })
})
