import 'jest'
import * as Sinon from 'sinon'
import { BodyParserMiddleware } from '../../../../lib/http/middleware/built-ins/BodyParserMiddleware'
import { ClassRegistry } from 'najs-binding'
import { isPromise } from '../../../../lib/private/isPromise'
import { HandlebarsHelper } from '../../../../lib/view/handlebars/HandlebarsHelper'
import { ViewResponse } from '../../../../lib/http/response/ViewResponse'
import { HandlebarsViewResponse } from '../../../../lib/view/handlebars/HandlebarsViewResponse'

describe('BodyParserMiddleware', function() {
  it('implements IAutoload and auto register', function() {
    const middleware = new BodyParserMiddleware('test')
    expect(middleware.getClassName()).toEqual(BodyParserMiddleware.className)
    expect(ClassRegistry.has(BodyParserMiddleware.className)).toBe(true)
  })

  describe('.parseParams()', function() {
    it('uses json and urlencoded by default', function() {
      const middleware = new BodyParserMiddleware('test')
      expect(middleware['useJson']).toBe(true)
      expect(middleware['useUrlEncoded']).toBe(true)
    })

    it('parse and set use[Parser] if provided, there are 4 types: raw, text, json, urlencoded', function() {
      let middleware = new BodyParserMiddleware('test', 'raw', 'text')
      expect(middleware['useJson']).toBe(false)
      expect(middleware['useUrlEncoded']).toBe(false)
      expect(middleware['useRaw']).toBe(true)
      expect(middleware['useText']).toBe(true)

      middleware = new BodyParserMiddleware('test', 'json', 'text')
      expect(middleware['useJson']).toBe(true)
      expect(middleware['useUrlEncoded']).toBe(false)
      expect(middleware['useRaw']).toBe(false)
      expect(middleware['useText']).toBe(true)
    })
  })

  describe('.createMiddleware()', function() {
    it('returns undefined if there is no Parser was used', function() {
      const middleware = new BodyParserMiddleware('test')
      middleware['useJson'] = false
      middleware['useUrlEncoded'] = false
      expect(middleware.createMiddleware()).toBeUndefined()
    })

    const parsers = ['Text', 'Json', 'UrlEncoded', 'Raw']
    for (const name of parsers) {
      it(
        'calls .get' + name + 'Options() and BodyParser.' + name.toLocaleLowerCase() + '() to create middleware',
        function() {
          const middleware = new BodyParserMiddleware('test', name.toLowerCase())
          const getOptionsSpy = Sinon.spy(middleware, <any>('get' + name + 'Options'))

          expect(middleware.createMiddleware()).toHaveLength(1)
          expect(getOptionsSpy.called).toBe(true)
          getOptionsSpy.restore()
        }
      )
    }
  })

  describe('.after()', function() {
    it('returns a promise', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = {}
      const instance = new BodyParserMiddleware('test')

      const returnValue = instance.after(<any>request, <any>response, result, <any>controller)
      expect(isPromise(returnValue)).toBe(true)
    })

    it('does nothing if the view is ViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new ViewResponse('test')
      const instance = new BodyParserMiddleware('test')

      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(returnValue === result).toBe(true)
    })

    it('calls result.helper and add "Input", "Body", "Query", "Params" helpers if the view is HandlebarsViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new HandlebarsViewResponse('test')

      const helper = () => {}
      const createHelperStub = Sinon.stub(HandlebarsHelper, 'create')
      createHelperStub.returns(helper)

      const instance = new BodyParserMiddleware('test')

      expect(result.getVariables()).toEqual({})
      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(result.getVariables()).toEqual({
        helpers: { Input: helper, Body: helper, Query: helper, Params: helper }
      })
      expect(returnValue === result).toBe(true)
      expect(createHelperStub.callCount).toEqual(4)
      createHelperStub.restore()
    })
  })
})
