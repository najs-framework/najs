import 'jest'
import * as Sinon from 'sinon'
import * as Middleware from '../../../../lib/http/middleware/built-ins/CsurfMiddleware'
import { ExpressMiddlewareBase } from '../../../../lib/http/middleware/ExpressMiddlewareBase'
import { isPromise } from '../../../../lib/private/isPromise'
import { ViewResponse } from '../../../../lib/http/response/types/ViewResponse'

describe('CsurfMiddleware', function() {
  it('extends ExpressMiddlewareBase', function() {
    const middleware = new Middleware.CsurfMiddleware('test')
    expect(middleware).toBeInstanceOf(ExpressMiddlewareBase)
  })

  it('implements IAutoload interface with class name "CsurfMiddleware"', function() {
    expect(new Middleware.CsurfMiddleware('test').getClassName()).toEqual(Middleware.CsurfMiddleware.className)
  })

  it('has shared Express.RequestHandler called CsurfProtection which not init by default', function() {
    expect(Middleware.CsurfProtection).toBeUndefined()
  })

  describe('.createMiddleware()', function() {
    it('creates CsurfProtection from "csurf" module with {cookie: true} options when constructor called', function() {
      const getOptionsSpy = Sinon.spy(Middleware.CsurfMiddleware.prototype, 'getOptions')
      const middleware = new Middleware.CsurfMiddleware('test')
      middleware.createMiddleware()
      expect(typeof Middleware.CsurfProtection === 'function').toBe(true)
      expect(getOptionsSpy.called).toBe(true)
      getOptionsSpy.restore()
    })

    it('creates CsurfProtection only one time', function() {
      const getOptionsSpy = Sinon.spy(Middleware.CsurfMiddleware.prototype, 'getOptions')
      const middleware = new Middleware.CsurfMiddleware('test')
      middleware.createMiddleware()
      expect(getOptionsSpy.called).toBe(false)
    })
  })

  describe('.after()', function() {
    it('returns a promise', async function() {
      const request = {}
      const response = {}
      const result = {}
      const instance = new Middleware.CsurfMiddleware('')

      const returnValue = instance.after(<any>request, <any>response, result)
      expect(isPromise(returnValue)).toBe(true)
    })

    it('returns result itself if it not a ViewResponse', async function() {
      const request = {}
      const response = {}
      const result = {}
      const instance = new Middleware.CsurfMiddleware('')

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
      const instance = new Middleware.CsurfMiddleware('')

      expect(result['variables']['csrfToken']).toBeUndefined()
      expect(result['variables']['CsrfToken']).toBeUndefined()
      expect(result['variables']['csrf_token']).toBeUndefined()
      expect(result['variables']['CSRF_TOKEN']).toBeUndefined()
      const value = await instance.after(<any>request, <any>response, result)
      expect(value === result).toBe(true)
      expect(result['variables']['csrfToken']).toEqual('test-csrf-token')
      expect(result['variables']['CsrfToken']).toEqual('test-csrf-token')
      expect(result['variables']['csrf_token']).toEqual('test-csrf-token')
      expect(result['variables']['CSRF_TOKEN']).toEqual('test-csrf-token')
    })
  })
})
