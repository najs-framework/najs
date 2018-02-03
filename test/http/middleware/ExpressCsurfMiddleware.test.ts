import { ViewResponse } from './../../../lib/http/response/types/ViewResponse'
import 'jest'
import * as Sinon from 'sinon'
import * as Middleware from '../../../lib/http/middleware/ExpressCsurfMiddleware'
import { make } from '../../../lib/core/make'
import { isPromise } from '../../../lib/private/isPromise'

describe('ExpressCsurfMiddleware', function() {
  it('has shared Express.RequestHandler called CsurfProtection which not init by default', function() {
    expect(Middleware.CsurfProtection).toBeUndefined()
  })

  it('creates CsurfProtection from "csurf" module with {cookie: true} options when constructor called', function() {
    const getOptionsSpy = Sinon.spy(Middleware.ExpressCsurfMiddleware.prototype, 'getOptions')
    make(Middleware.ExpressCsurfMiddleware.className)
    expect(typeof Middleware.CsurfProtection === 'function').toBe(true)
    expect(getOptionsSpy.called).toBe(true)
    getOptionsSpy.restore()
  })

  it('creates CsurfProtection only one time', function() {
    const getOptionsSpy = Sinon.spy(Middleware.ExpressCsurfMiddleware.prototype, 'getOptions')
    make(Middleware.ExpressCsurfMiddleware.className)
    expect(getOptionsSpy.called).toBe(false)
  })

  it('implements IAutoload interface with class name "ExpressCsurfMiddleware"', function() {
    expect(new Middleware.ExpressCsurfMiddleware().getClassName()).toEqual('ExpressCsurfMiddleware')
  })

  describe('.before()', function() {
    it('returns a promise, which calls CsurfProtection with request, response and fake next function', async function() {
      const request = {}
      const response = {}
      const instance = new Middleware.ExpressCsurfMiddleware()

      function fakeCsurfProtection(request: any, response: any, done: any) {
        done()
      }

      const csurfProtectionStub = Sinon.stub(Middleware, 'CsurfProtection')
      csurfProtectionStub.returned(fakeCsurfProtection)

      const result = instance.before(<any>request, <any>response)

      expect(isPromise(result)).toBe(true)
      expect(csurfProtectionStub.firstCall.args[0] === request).toBe(true)
      expect(csurfProtectionStub.firstCall.args[1] === response).toBe(true)
      expect(typeof csurfProtectionStub.firstCall.args[2] === 'function').toBe(true)
      csurfProtectionStub.restore()
    })
  })

  describe('.after()', function() {
    it('returns a promise', async function() {
      const request = {}
      const response = {}
      const result = {}
      const instance = new Middleware.ExpressCsurfMiddleware()

      const returnValue = instance.after(<any>request, <any>response, result)
      expect(isPromise(returnValue)).toBe(true)
    })

    it('returns result itself if it not a ViewResponse', async function() {
      const request = {}
      const response = {}
      const result = {}
      const instance = new Middleware.ExpressCsurfMiddleware()

      const value = await instance.after(<any>request, <any>response, result)
      expect(value === result).toBe(true)
    })

    it('calls .with("csrfToken") if result is a ViewResponse, csrf get from request.csrfToken()', async function() {
      const request = {
        csrfToken() {
          return 'test-csrf-token'
        }
      }
      const response = {}
      const result = new ViewResponse('any')
      const instance = new Middleware.ExpressCsurfMiddleware()

      expect(result['variables']['csrfToken']).toBeUndefined()
      const value = await instance.after(<any>request, <any>response, result)
      expect(value === result).toBe(true)
      expect(result['variables']['csrfToken']).toEqual('test-csrf-token')
    })
  })
})
