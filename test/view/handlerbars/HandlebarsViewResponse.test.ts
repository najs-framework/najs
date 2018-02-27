import 'jest'
import * as Sinon from 'sinon'
import { ResponseTypeClass } from '../../../lib/constants'
import { ViewResponse } from '../../../lib/http/response/types/ViewResponse'
import { HandlebarsViewResponse } from '../../../lib/view/handlebars/HandlebarsViewResponse'

describe('HandlebarsViewResponse', function() {
  it('extends ViewResponse', function() {
    const handlebarsView = new HandlebarsViewResponse('test')
    expect(handlebarsView).toBeInstanceOf(ViewResponse)
  })

  it('returns different class name', function() {
    const handlebarsView = new HandlebarsViewResponse('test')
    expect(handlebarsView.getClassName()).toEqual(ResponseTypeClass.HandlebarsView)
  })

  describe('.helper()', function() {
    it('is chain-able', function() {
      const handlebarsView = new HandlebarsViewResponse('test')
      expect(handlebarsView.helper('test', () => {}) === handlebarsView).toBe(true)
    })

    it('registers an handlebars instance level helper by assign helpers to "helpers" in variables', function() {
      const handlebarsView = new HandlebarsViewResponse('test')
      const withSpy = Sinon.spy(handlebarsView, 'with')
      const helper = () => {}
      handlebarsView.helper('test', helper)
      expect(withSpy.calledWith('helpers.test', helper)).toBe(true)
      withSpy.restore()
    })

    it('can register same helper with multiple name', function() {
      const handlebarsView = new HandlebarsViewResponse('test')
      const helper = () => {}
      handlebarsView.helper(['a', 'b'], helper)
      expect(handlebarsView.getVariables()).toEqual({
        helpers: {
          a: helper,
          b: helper
        }
      })
    })
  })
})
