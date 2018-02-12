import 'jest'
import * as Make from '../../../lib/core/make'
import * as Sinon from 'sinon'
import { GlobalFacade } from '../../../lib/constants'
import { DispatcherFacade } from '../../../lib/facades/global/DispatcherFacade'

describe('DispatcherFacade', function() {
  it('calls make() to create new instance of Dispatcher as a facade root', function() {
    const makeSpy = Sinon.spy(Make, 'make')
    DispatcherFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(GlobalFacade.Event)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
