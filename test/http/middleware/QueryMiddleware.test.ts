import 'jest'
import * as Sinon from 'sinon'
import { QueryMiddleware } from '../../../lib/http/middleware/QueryMiddleware'
import { isPromise } from '../../../lib/private/isPromise'
import { ViewResponse } from '../../../lib/http/response/types/ViewResponse'
import { HandlebarsHelper } from '../../../lib/view/handlebars/HandlebarsHelper'
import { HandlebarsViewResponse } from '../../../lib/view/handlebars/HandlebarsViewResponse'

describe('QueryMiddleware', function() {
  it('is fit for najs-binding', function() {
    expect(QueryMiddleware.className).toEqual('Najs.QueryMiddleware')
  })

  describe('.after()', function() {
    it('returns a promise', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = {}
      const instance = new QueryMiddleware()

      const returnValue = instance.after(<any>request, <any>response, result, <any>controller)
      expect(isPromise(returnValue)).toBe(true)
    })

    it('does nothing if the view is ViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new ViewResponse('test')
      const instance = new QueryMiddleware()

      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(returnValue === result).toBe(true)
    })

    it('calls result.helper and add "Query" helper if the view is HandlebarsViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new HandlebarsViewResponse('test')

      const helper = () => {}
      const createHelperStub = Sinon.stub(HandlebarsHelper, 'create')
      createHelperStub.returns(helper)

      const instance = new QueryMiddleware()

      expect(result.getVariables()).toEqual({})
      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(result.getVariables()).toEqual({ helpers: { Query: helper } })
      expect(returnValue === result).toBe(true)

      expect(createHelperStub.callCount).toEqual(1)

      createHelperStub.restore()
    })
  })
})
