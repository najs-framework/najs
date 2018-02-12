import 'jest'
import * as Make from '../../../lib/core/make'
import * as Sinon from 'sinon'
import { GlobalFacade } from '../../../lib/constants'
import { EventFacade } from '../../../lib/facades/global/EventFacade'

describe('EventFacade', function() {
  it('calls make() to create new instance of Event as a facade root', function() {
    const makeSpy = Sinon.spy(Make, 'make')
    EventFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(GlobalFacade.Event)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
