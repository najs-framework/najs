import 'jest'
import * as Sinon from 'sinon'
import { InputMiddleware } from '../../../lib/http/middleware/InputMiddleware'
import { isPromise } from '../../../lib/private/isPromise'
import { ViewResponse } from '../../../lib/http/response/types/ViewResponse'
import { HandlebarsHelper } from '../../../lib/view/handlebars/HandlebarsHelper'
import { HandlebarsViewResponse } from '../../../lib/view/handlebars/HandlebarsViewResponse'

describe('InputMiddleware', function() {
  it('is fit for najs-binding', function() {
    expect(InputMiddleware.className).toEqual('Najs.InputMiddleware')
  })

  describe('.after()', function() {
    it('returns a promise', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = {}
      const instance = new InputMiddleware()

      const returnValue = instance.after(<any>request, <any>response, result, <any>controller)
      expect(isPromise(returnValue)).toBe(true)
    })

    it('does nothing if the view is ViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new ViewResponse('test')
      const instance = new InputMiddleware()

      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(returnValue === result).toBe(true)
    })

    it('calls result.helper and add "Input" helper if the view is HandlebarsViewResponse', async function() {
      const request = {}
      const response = {}
      const controller = {}
      const result = new HandlebarsViewResponse('test')

      const helper = () => {}
      const createHelperStub = Sinon.stub(HandlebarsHelper, 'create')
      createHelperStub.returns(helper)

      const instance = new InputMiddleware()

      expect(result.getVariables()).toEqual({})
      const returnValue = await instance.after(<any>request, <any>response, result, <any>controller)
      expect(result.getVariables()).toEqual({ helpers: { Input: helper } })
      expect(returnValue === result).toBe(true)

      expect(createHelperStub.callCount).toEqual(1)

      createHelperStub.restore()
    })
  })
})
