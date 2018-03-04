import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { Cookie } from '../../../lib/facades/contextual/CookieContextualFacade'

describe('CookieContextualFacade', function() {
  it('is created only one time if context has no "cookie" property', function() {
    const request = {
      method: 'GET'
    }
    const context = { request: request }
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    Cookie.of(<any>context)
    expect(context['cookie'] === Cookie.of(<any>context)).toBe(true)
    expect(context['cookie'] === Cookie.of(<any>context)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
