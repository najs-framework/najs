import 'jest'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { DispatcherFacade } from '../../../lib/facades/global/DispatcherFacade'

describe('DispatcherFacade', function() {
  it('calls make() to create new instance of Dispatcher as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    DispatcherFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith('Najs.Event.EventDispatcher')).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
