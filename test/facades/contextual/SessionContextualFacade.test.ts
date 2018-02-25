import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { Session } from '../../../lib/facades/contextual/SessionContextualFacade'

describe('SessionContextualFacade', function() {
  it('is created only one time if context has no "session" property', function() {
    const request = {
      method: 'GET'
    }
    const context = { request: request }
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    Session.of(<any>context)
    expect(context['session'] === Session.of(<any>context)).toBe(true)
    expect(context['session'] === Session.of(<any>context)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
