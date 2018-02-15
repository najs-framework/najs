import 'jest'
import { ExpressController } from '../../../lib/http/controller/ExpressController'
import { ContextualFacade } from '../../../lib/facades/ContextualFacade'

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
})
