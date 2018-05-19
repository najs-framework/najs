import 'jest'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { EventFacade } from '../../../lib/facades/global/EventFacade'

describe('EventFacade', function() {
  it('calls make() to create new instance of Event as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    EventFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith('Najs.Event.EventDispatcher')).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
