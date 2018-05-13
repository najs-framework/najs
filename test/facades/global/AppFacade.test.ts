import 'jest'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { AppFacade } from '../../../lib/facades/global/AppFacade'

describe('AppFacade', function() {
  it('calls make() to create new instance of Application as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    AppFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith('Najs.Application')).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
