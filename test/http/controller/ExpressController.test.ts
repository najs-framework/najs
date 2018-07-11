import 'jest'
import { ContextualFacade } from 'najs-facade'
import { ExpressController } from '../../../lib/http/controller/ExpressController'
import { MemberProxy } from '../../../lib/http/controller/MemberProxy'
import { Session } from '../../../lib/http/session/Session'
import { Cookie } from '../../../lib/http/cookie/Cookie'

describe('ExpressController', function() {
  describe('.constructor()', function() {
    it('should init body, params, and query from request', function() {
      const request = {
        method: 'GET',
        body: { a: 1 },
        query: { b: 2 },
        params: { c: 3 }
      }
      const expressController = Reflect.construct(ExpressController, [request, {}])
      expect(expressController['body']['data'] === request.body).toBe(true)
      expect(expressController['query']['data'] === request.query).toBe(true)
      expect(expressController['params']['data'] === request.params).toBe(true)
    })

    it('can init an empty Object if there is no body/query/params', function() {
      const request = {
        method: 'GET'
      }
      const expressController = Reflect.construct(ExpressController, [request, {}])
      expect(expressController['body']['data']).toEqual({})
      expect(expressController['query']['data']).toEqual({})
      expect(expressController['params']['data']).toEqual({})
    })

    it('should init Input from `InputContextualFacade` with context is this', function() {
      const request = {
        method: 'get'
      }
      const expressController: ExpressController = Reflect.construct(ExpressController, [request, {}])
      expect(expressController.input).toBeInstanceOf(ContextualFacade)
      expect(expressController.input['context'] === expressController).toBe(true)
    })
  })

  describe('.session', function() {
    it('should be an instance of MemberProxy by default, .get() always returns a defaultValue', function() {
      const request = {
        method: 'get'
      }
      const expressController: ExpressController = Reflect.construct(ExpressController, [request, {}])
      expect(expressController.session).toBeInstanceOf(MemberProxy)
      expect(expressController.session.get('something', 123)).toEqual(123)
    })

    it('should be an instance of Session if there is session in request', function() {
      const request = {
        method: 'get',
        session: {}
      }
      const expressController: ExpressController = Reflect.construct(ExpressController, [request, {}])
      expect(expressController.session).toBeInstanceOf(Session)
    })
  })

  describe('.cookie', function() {
    it('should be an instance of MemberProxy by default, .get() always returns a defaultValue', function() {
      const request = {
        method: 'get'
      }
      const expressController: ExpressController = Reflect.construct(ExpressController, [request, {}])
      expect(expressController.cookie).toBeInstanceOf(MemberProxy)
      expect(expressController.cookie.get('something', 123)).toEqual(123)
    })

    it('should be an instance of Cookie if there is cookies || signedCookie in request', function() {
      const request = {
        method: 'get',
        cookies: {}
      }
      const expressController: ExpressController = Reflect.construct(ExpressController, [request, {}])
      expect(expressController.cookie).toBeInstanceOf(Cookie)
    })
  })
})
