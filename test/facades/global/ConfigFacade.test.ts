import 'jest'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { GlobalFacadeClass } from '../../../lib/constants'
import { ConfigFacade } from '../../../lib/facades/global/ConfigFacade'

describe('ConfigFacade', function() {
  it('calls make() to create new instance of Config as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    ConfigFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(GlobalFacadeClass.Config)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
