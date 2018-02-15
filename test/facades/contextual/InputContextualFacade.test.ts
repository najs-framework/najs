import 'jest'
import * as Sinon from 'sinon'
import * as Make from '../../../lib/core/make'
import { Input } from '../../../lib/facades/contextual/InputContextualFacade'

describe('InputContextualFacade', function() {
  it('is created only one time if context has no "input" property', function() {
    const request = {
      method: 'GET'
    }
    const context = { request: request }
    const makeSpy = Sinon.spy(Make, 'make')
    Input.of(<any>context)
    expect(context['input'] === Input.of(<any>context)).toBe(true)
    expect(context['input'] === Input.from(<any>context)).toBe(true)
    expect(context['input'] === Input.of(<any>context)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
